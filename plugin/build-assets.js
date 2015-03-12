var fs = Npm.require('fs-extra'),
    gm = Npm.require('gm'),
    path = Npm.require('path'),
    mkdirp = Npm.require('mkdirp'),
    async = Npm.require('async'),
    asyncEachObject = Npm.require('async-each-object'),
    appDir = this.process.env.PWD;

var types = [];

// Favicon Preset
types.favicon = [
  { name: "favicon.png",                              size: 32 },
  { name: "apple-touch-icon-72x72-precomposed.png",   size: 72 },
  { name: "apple-touch-icon-120x120-precomposed.png", size: 120 },
  { name: "apple-touch-icon-152x152-precomposed.png", size: 152 },
  { name: "pinned.png",                               size: 144 },
  { name: "favicon-coast.png",                        size: 228 }
]

// iOS Icons Preset
types.ios = [
  { name: "sourceRequirements",       size: 1024 },
  { name: "Icon-60.png",              size: 60 },
  { name: "Icon-60@2x.png",           size: 120 },
  { name: "Icon-60@3x.png",           size: 180 },
  { name: "Icon-72.png",              size: 72 },
  { name: "Icon-72@2x.png",           size: 144 },
  { name: "Icon-76.png",              size: 76 },
  { name: "Icon-76@2x.png",           size: 152 },
  { name: "Icon-76@3x.png",           size: 228 },
  { name: "Icon-Small-50.png",        size: 50 },
  { name: "Icon-Small-50@2x.png",     size: 100 },
  { name: "Icon-Small.png",           size: 29 },
  { name: "Icon-Small@2x.png",        size: 58 },
  { name: "Icon-Small@3x.png",        size: 87 },
  { name: "Icon-Spotlight-40.png",    size: 40 },
  { name: "Icon-Spotlight-40@2x.png", size: 80},
  { name: "Icon-Spotlight-40@3x.png", size: 120 },
  { name: "Icon.png",                 size: 57 },
  { name: "Icon@2x.png",              size: 114 },
  { name: "iTunesArtwork",            size: 512 },
  { name: "iTunesArtwork@2x",         size: 1024 }
]

// Android Icons Preset
types.android = [
  { name:"ic_launcher.png",    size: 72, dir: "drawable-hdmi" },
  { name:"ic_launcher.png",    size: 36, dir: "drawable-ldpi" },
  { name:"ic_launcher.png",    size: 48, dir: "drawable-mdpi" },
  { name:"ic_launcher.png",    size: 96, dir: "drawable-xhdpi" },
  { name:"ic_launcher.png",    size: 144, dir: "drawable-xxhdpi" },
  { name:"ic_launcher.png",    size: 192, dir: "drawable-xxxhdpi" },
  { name:"playstore-icon.png", size: 512 }
]

// Mac OS X Icons Preset
types.mac = [
  { name:"Icon_16x16.png",      size: 16 },
  { name:"Icon_16x16@2x.png",   size: 32 },
  { name:"Icon_16x16@3x.png",   size: 48 },
  { name:"Icon_32x32.png",      size: 32 },
  { name:"Icon_32x32@2x.png",   size: 64 },
  { name:"Icon_32x32@3x.png",   size: 96 },
  { name:"Icon_128x128.png",    size: 128 },
  { name:"Icon_128x128@2x.png", size: 256 },
  { name:"Icon_128x128@3x.png", size: 384 },
  { name:"Icon_256x256.png",    size: 256 },
  { name:"Icon_256x256@2x.png", size: 512 },
  { name:"Icon_256x256@3x.png", size: 768 },
  { name:"Icon_512x512.png",    size: 512 },
  { name:"Icon_512x512@2x.png", size: 1024 },
  { name:"Icon_512x512@3x.png", size: 1536 }
]

// Custom Type Handling
types.custom = [{ custom: true }];

Builder = {
  checkConfigChanges: function (config, configPath, callback) {
    var self = this;
    if (fs.existsSync(path.join(configPath, 'config.assets'))) {
      fs.readFile(path.join(configPath, 'config.assets'), 'utf8', Meteor.bindEnvironment(function read(err, cachedConfig) {
        if (err)
          self.error({message: "Asset builder: " + err});

        callback(cachedConfig != config);
        self.cacheConfig(config, configPath);
      }));
    } else {
      // Cache last assets config
      self.cacheConfig(configPath);
      callback(true);
    }
  },

  cacheConfig: function (config, configPath) {
    fs.outputFile(path.join(configPath, 'config.assets'), config, Meteor.bindEnvironment(function (err) {
      if (err) 
        self.error({message: "Asset builder: " + err});
    }));
  },

  checkSourceChanges: function (config, cachePath, callback) {
    var combinedSources = [], self = this;

    // Get all sources 
    _.each(config, function (options) {
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

      if (fs.existsSync(path.join(cachePath, sourceFileName))) {
        
        gm.compare(path.join(appDir, source), path.join(cachePath, sourceFileName), 0.02, Meteor.bindEnvironment(function (err, isEqual, equality, raw, path1, path2) {
          if (err)
            self.error({message: "Asset builder: " + err});
          if (isEqual) {
            callback(false);
          } else {
            self.cacheSource(source, cachePath);
            callback(true);
          }
        }));
      } else {
        // Cache last assets config
        self.cacheSource(source, cachePath);
        callback(true);
      }


    }, function (err) {
      if (err){
        callback(true)
      } else {
        callback(false);
      }
    });
  },

  cacheSource: function (source, cachePath) {
    var self = this;
    fs.copy(path.join(appDir, source), path.join(cachePath, source.replace("/", "|")), Meteor.bindEnvironment(function(err) {
      if (err) 
        self.error({message: "Asset builder: " + err});
    }));
  },

  build: function (config) {
    var self = this;

    // Iterate through each config option
    async.eachObject(config, function (options, configName, callback) {
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
        self.error({message: "Asset builder: No source provided for " + options.name});
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
          var images = types[type], rootOutput;

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
                    self.error({message: "Asset builder: Source image needs to be " + requirements.height + "x" + requirements.width + " for type " + name});
                } else {
                  self.error({message: "Asset builder: " + err});
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
                self.error({message: "Asset builder: " + err});

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
                        self.error({message: "Asset builder: " + err});
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
                        self.error({message: "Asset builder: " + err});

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
                        self.error({message: "Asset builder: " + err});
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
}



/**
 * Build Assets
 */
var buildAssets = function (compileStep) {
  var configRaw = compileStep.read().toString('utf8');
  var config = JSON.parse(configRaw);
  var assetCachePath = path.join(appDir, '.meteor/local/assets-build');

  Builder.error = function (obj) {
    compileStep.error(obj);
  }

  Builder.checkConfigChanges(configRaw, assetCachePath, function (changes) {
    if (changes) {
      Builder.build(config);
    } else {
      Builder.checkSourceChanges(config, assetCachePath, function (changes) {
        if (changes) {
          Builder.build(config);
        } else {
          return;
        }
      })
    }
  });
}

Plugin.registerSourceHandler("assets", buildAssets);