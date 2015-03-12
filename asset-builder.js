var fs = Npm.require('fs-extra'),
    gm = Npm.require('gm'),
    path = Npm.require('path'),
    mkdirp = Npm.require('mkdirp'),
    async = Npm.require('async'),
    asyncEachObject = Npm.require('async-each-object'),
    appDir = this.process.env.PWD;


AssetBuilder = function (options) {

  // Raw copy of the config file.
  this.configRaw = options.config;

  // JSON parsed config file
  this.config = JSON.parse(options.config);

  // Location to cache the assets for diffing
  this.cachePath = options.cachePath;
}
 
AssetBuilder.prototype.error = function (message) {
  console.log(message);
}

AssetBuilder.prototype.checkConfigChanges = function (callback) {
  var self = this;
  if (fs.existsSync(path.join(self.cachePath, 'config.assets'))) {
    fs.readFile(path.join(self.cachePath, 'config.assets'), 'utf8', Meteor.bindEnvironment(function read(err, cachedConfig) {
      if (err)
        self.error("Asset builder: " + err);

      callback(cachedConfig != self.config);
      self.cacheConfig();
    }));
  } else {
    // Cache last assets config
    self.cacheConfig();
    callback(true);
  }
};

AssetBuilder.prototype.cacheConfig = function () {
  var self = this;
  fs.outputFile(path.join(self.cachePath, 'config.assets'), this.config, Meteor.bindEnvironment(function (err) {
    if (err) 
      self.error("Asset builder: " + err);
  }));
}

AssetBuilder.prototype.checkSourceChanges = function (callback) {
  var combinedSources = [], self = this;

  // Get all sources 
  _.each(self.config, function (options) {
    if (!_.isArray(options.source)) {
      options.source = [options.source];
    }
    _.each(options.source, function (source) {
      combinedSources.push(source);
    });
  });

  // Get unique list of sources
  combinedSources = _.uniq(combinedSources);

  // Check if each source has changed
  async.each(combinedSources, function (source, callback) {

    var sourceFileName = source.replace("/", "|");

    if (fs.existsSync(path.join(self.cachePath, sourceFileName))) {
      
      gm.compare(path.join(appDir, source), path.join(self.cachePath, sourceFileName), 0.02, Meteor.bindEnvironment(function (err, isEqual, equality, raw, path1, path2) {
        if (err)
          self.error("Asset builder: " + err);
        if (isEqual) {
          callback(false);
        } else {
          self.cacheSource(source, self.cachePath);
          callback(true);
        }
      }));
    } else {
      // Cache last assets config
      self.cacheSource(source, self.cachePath);
      callback(true);
    }


  }, function (err) {
    if (err){
      callback(true)
    } else {
      callback(false);
    }
  });
}

AssetBuilder.prototype.cacheSource = function (source) {
  var self = this;
  fs.copy(path.join(appDir, source), path.join(self.cachePath, source.replace("/", "|")), Meteor.bindEnvironment(function(err) {
    if (err) 
      self.error("Asset builder: " + err);
  }));
}

AssetBuilder.prototype.build = function () {
  var self = this;

  // Iterate through each config option
  async.eachObject(self.config, function (options, configName, callback) {
    var options = _.extend({
      output: "resources",
      quality: 100
    }, options), type, source, output, quality, retina, customHeight, customWidth;

    // Type
    if (_.has(options, "type")) {
      type = options.type;
    } else {
      type = ["custom"];
    }

    // Retina 
    if (options.retina) {
      retina = options.retina;
    }

    // Height
    if (options.height) {
      customHeight = options.height;
    }
  
    // Width
    if (options.width) {
      customWidth = options.width;
    }

    // Quality
    quality = options.quality;

    // Output
    output = options.output;

    // Source
    if (typeof options.source === 'undefined') {
      self.error("Asset builder: No source provided for " + options.name);
    }

    // Turn source into an Array
    if (!_.isArray(options.source)) {
      source = [options.source];
    } else {
      source = options.source;
    }
    
    // Iterate through each source
    async.each(source, function (source, callback){
      var sourcePath = path.join(appDir,source);

      // Name 
      if (options.name) {
        var customName = options.name.replace("{{source}}", path.basename(options.source).split('.')[0])
      }

      // Iterate through teach type and generate images
      async.each(type, function (type, callback) {
        var images = Presets[type], rootOutput;

        if (images) {

          // Source requirements
          if (images.sourceRequirements) {
            var requirements = images.sourceRequirements;
            delete images.sourceRequirements;

            // Square Images
            if (requirements.size) {
              requirements.width = requirements.height = requirements.size;
            }

            // Check the source image size
            gm(sourcePath).size(Meteor.bindEnvironment(function (err, size) {
              if (!err){
                if (size.width != requirements.width || size.height != requirements.height)
                  self.error("Asset builder: Source image needs to be " + requirements.height + "x" + requirements.width + " for type " + name);
              } else {
                self.error("Asset builder: " + err);
              }
            }));
          }

          // If not custom name space the output dir
          if (type != "custom") {
            rootOutput = path.join(appDir, output, type)
          } else {
            rootOutput = path.join(appDir, output)
          }

          // Make the path if it doesn't exist
          mkdirp(rootOutput, Meteor.bindEnvironment(function (err) {
            if (err)
              self.error("Asset builder: " + err);

            // Process each image
            async.each(images, function (options, callback) {
              var outputDir = "",

              // Resize
              resize = function (output, options, type) {

                gm(sourcePath)
                  .resize(options.height, options.width, type)
                  .quality(quality)
                  .write(output, Meteor.bindEnvironment(function (err) {
                    if (err)
                      self.error("Asset builder: " + err);
                  }));
              };

              var name = options.name || customName || path.basename(source);
              var height = options.height || customHeight;
              var width = options.width || customWidth;

              if (options.size || (width && height)) {

                // Square Images
                if (options.size) {
                  width = height = options.size;
                }

                // Wrapper Directory
                if (options.dir) {
                  outputDir = path.join(rootOutput, options.dir);

                  // Create wrapper div
                  mkdirp(outputDir, Meteor.bindEnvironment(function (err) {
                    if (err)
                      self.error("Asset builder: " + err);

                    if (retina) {
                      resize(path.join(rootOutput, name), {height: height * .5, width: height * .5}, "!");
                      var split = name.split(".");
                      name = split[0] + "@2x." + split[1];
                    }

                    resize(path.join(outputDir, name), {height: height, width: width}, "!");
                  }));
                } else {
                  if (retina) {
                    resize(path.join(rootOutput, name), {height: height * .5, width: height * .5}, "!");
                    var split = name.split(".");
                    name = split[0] + "@2x." + split[1];
                  }

                  resize(path.join(rootOutput, name), {height: height, width: width}, "!");
                }

              } else {
                if (retina) {
                  resize(path.join(rootOutput, name), {height: 50, width: 50}, "%");
                  var split = name.split(".");
                  name = split[0] + "@2x." + split[1];
                }

                gm(sourcePath)
                  .quality(quality)
                  .write(path.join(rootOutput, name), Meteor.bindEnvironment(function (err) {
                    if (err)
                      self.error("Asset builder: " + err);
                    callback();
                  }));
              }
            }, function (err) {
              callback();
            });
          }));
        }
      }, function (err) {
        callback();
      });
    }, function (err) {
      callback();
    });
  }, function (err) {
  });
}
