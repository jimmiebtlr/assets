var fs = require('fs-extra'),
    gm = require('gm'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    async = require('async'),
    _ = require('underscore'),
    Presets = require('./presets.js'),
    asyncEachObject = require('async-each-object')

/**
 * Assets constructor 
 * @param {Object} options 
 *   @property {String} config    the raw asset builder config file
 *   @property {String} cachePath the path realtive to rootDir to cache the files for diffing
 *   @property {String} rootDir   the path of the root directory to base relative paths off of
 */
Assets = function (options) {

  // Raw copy of the config file.
  this._configRaw = options.config;

  // JSON parsed config file
  this._config = JSON.parse(options.config);

  // Location to cache the assets for diffing
  this._cachePath = options.cachePath || ".assets";

  // Root directory of appliction
  this._rootDir = options.rootDir;

  // Logging
  this._logging = options.logging || false;
}

/**
 * This is the only public api method. It checks for the config has changed or sources
 * have changed and runs the build method if they have.
 */
Assets.prototype.run = function (callback) {
  var self = this;
  // 
  self._checkConfigChanges(function (changes) {
    if (changes) {
      self.build(function () {
        if (callback) 
          callback();
      });
    } else {
      self._checkSourceChanges(function (changes) {
        if (changes) {
          self.build(function () {
            if (callback)
              callback();
          });
        } else {
          callback();
        }
      })
    }
  });
}
 
/**
 * Use for command line logging
 * @param  {String} message Log message
 */
Assets.prototype.log = function (message) {
  if (this._logging) {
    console.log(message);
  }
}

/**
 * This method is to give non-build pluggin's a fallback error message
 * @param  {String} message Error message
 */
Assets.prototype.error = function (message) {
  console.log(message);
}

/**
 * Checks if the new config is different from the cached config
 * @param  {Function} callback This method is called after the config diff returns
 */
Assets.prototype._checkConfigChanges = function (callback) {
  var self = this;
  self.log("Checking for config changes...");
  if (fs.existsSync(path.join(self._cachePath, 'config.assets'))) {
    fs.readFile(path.join(self._cachePath, 'config.assets'), 'utf8', function read(err, cachedConfig) {
      if (err)
        self.error("Asset builder: " + err);

      if (cachedConfig != self._configRaw) {
        self.log("* Config has been changed since last run.");
        callback(true);
        self._cacheConfig();
      } else {
        self.log("* No config changes since last run.");
        callback(false);
      }
      

    });
  } else {
      self.log("* No cached config found.");
    // Cache last assets config
    self._cacheConfig();
    callback(true);
  }
};

/**
 * Caches the config for future diffing
 */
Assets.prototype._cacheConfig = function () {
  var self = this;
  fs.outputFile(path.join(self._cachePath, 'config.assets'), self._configRaw, function (err) {
    if (err) 
      self.error("Asset builder: " + err);
    self.log("Cached assets config file.");
  });
}

/**
 * Checks if the new source image is different from the cached image
 * @param  {Function} callback This method is called after the image diff returns
 */
Assets.prototype._checkSourceChanges = function (callback) {
  var combinedSources = [], self = this;

  self.log("Checking for changed source image files...");

  // Get all sources 
  _.each(self._config, function (options) {
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

    if (fs.existsSync(path.join(self._cachePath, sourceFileName))) {
      
      gm.compare(path.join(self._rootDir, source), path.join(self._cachePath, sourceFileName), 0.02, function (err, isEqual, equality, raw, path1, path2) {
        if (err)
          self.error("Asset builder: " + err);
        if (isEqual) {
          self.log("* " + source + " has not changed.");
          callback(false);
        } else {
          self.log("* " + source + " has changed.");
          self._cacheSource(source, self._cachePath);
          callback(true);
        }
      });
    } else {
      // Cache last assets config
      self._cacheSource(source, self._cachePath);
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

/**
 * Chache the source image for later diffing
 * @param  {String} source Path of the image to cache
 */
Assets.prototype._cacheSource = function (source) {
  var self = this;
  fs.copy(path.join(self._rootDir, source), path.join(self._cachePath, source.replace("/", "|")), function(err) {
    if (err) 
      self.error("Asset builder: " + err);
    self.log("Caching " + source);
  });
}

/**
 * Interprets the config and loops through the config options, sources, presets and
 * builds the images.
 * 
 * TODO: Break this up into smaller methods
 */
Assets.prototype.build = function (callback) {
  var self = this;

  self.log("Building assets... ");

  // Iterate through each config option
  async.eachObject(self._config, function (options, configName, callback) {
    var options = _.extend({
      output: "resources",
      quality: 100
    }, options), type, source, output, quality, retina, customHeight, customWidth;

    self.log("Processing " + configName + "...");

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
      var sourcePath = path.join(self._rootDir,source);

      // Name 
      if (options.name) {
        var customName = options.name.replace("{{source}}", path.basename(options.source).split('.')[0])
      }

      // Iterate through teach type and generate images
      async.each(type, function (type, callback) {
        var images = Presets[type], rootOutput;

        self.log("* Using " + type + " preset");

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
            gm(sourcePath).size(function (err, size) {
              if (!err){
                if (size.width != requirements.width || size.height != requirements.height)
                  self.error("Asset builder: Source image needs to be " + requirements.height + "x" + requirements.width + " for type " + name);
              } else {
                self.error("Asset builder: " + err);
              }
            });
          }

          // If not custom name space the output dir
          if (type != "custom") {
            rootOutput = path.join(self._rootDir, output, type)
          } else {
            rootOutput = path.join(self._rootDir, output)
          }

          // Make the path if it doesn't exist
          mkdirp(rootOutput, function (err) {
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
                  .write(output, function (err) {
                    if (err)
                      self.error("Asset builder: " + err);
                  });
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
                  mkdirp(outputDir, function (err) {
                    if (err)
                      self.error("Asset builder: " + err);

                    if (retina) {
                      resize(path.join(rootOutput, name), {height: height * .5, width: height * .5}, "!");
                      var split = name.split(".");
                      name = split[0] + "@2x." + split[1];
                    }

                    resize(path.join(outputDir, name), {height: height, width: width}, "!");
                    callback();
                  });
                } else {
                  if (retina) {
                    resize(path.join(rootOutput, name), {height: height * .5, width: height * .5}, "!");
                    var split = name.split(".");
                    name = split[0] + "@2x." + split[1];
                  }

                  resize(path.join(rootOutput, name), {height: height, width: width}, "!");
                  callback();
                }

              } else {
                if (retina) {
                  resize(path.join(rootOutput, name), {height: 50, width: 50}, "%");
                  var split = name.split(".");
                  name = split[0] + "@2x." + split[1];
                }

                gm(sourcePath)
                  .quality(quality)
                  .write(path.join(rootOutput, name), function (err) {
                    if (err)
                      self.error("Asset builder: " + err);
                    callback();
                  });
              }
            }, function (err) {
              callback();
            });
          });
        }
      }, function (err) {
        callback();
      });
    }, function (err) {
      callback();
    });
  }, function (err) {
    callback();
  });
}

module.exports = Assets;
