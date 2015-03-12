var fs = Npm.require('fs'), 
    gm = Npm.require('gm'),
    path = Npm.require('path'),
    mkdirp = Npm.require('mkdirp'),
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

/**
 * Build Assets
 */
var buildAssets = function (compileStep) {
  var config = JSON.parse(compileStep.read().toString('utf8'));

  // Iterate through each config option
  _.each(config, function (options) {
    var options = _.extend({
      output: "resources"
    }, options), type, source, output;

    // Type
    if (typeof options.type === 'undefined') {
      compileStep.error({message: "Asset builder: No type provided for " + options.name});
    }
    type = options.type;

    // Source
    if (typeof options.source === 'undefined') {
      compileStep.error({message: "Asset builder: No source provided for " + options.name});
    }
    source = path.join(appDir, options.source);

    // Output
    output = options.output;

    // Iterate through teach type and generate images
    _.each(type, function (type) {
      var images = types[type];

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
          gm(source).size(Meteor.bindEnvironment(function (err, size) {
            if (!err){
              if (size.width != requirements.width || size.height != requirements.height)
                compileStep.error({message: "Asset builder: Source image needs to be " + requirements.height + "x" + requirements.width + " for type " + name});
            } else {
              compileStep.error({message: "Asset builder: " + err});
            }
          }));
        }

        // Make the path if it doesn't exist
        mkdirp(path.join(appDir, output, type), Meteor.bindEnvironment(function (err) {
          if (err)
            compileStep.error({message: "Asset builder: " + err});

          // Resize each image
          _.each(images, function (options) {
            var outputDir = "",

            // Resize
            resize = function (output, options) {
              gm(source)
                .resize(options.height, options.width)
                .write(output, Meteor.bindEnvironment(function (err) {
                  if (err)
                    compileStep.error({message: "Asset builder: " + err});
                }));
            };

            // Square Images
            if (options.size) {
              options.width = options.height = options.size;
            }

            // Wrapper Directory
            if (options.dir) {
              outputDir = path.join(appDir, output, type, options.dir);

              // Create wrapper div
              mkdirp(outputDir, Meteor.bindEnvironment(function (err) {
                if (err)
                  compileStep.error({message: "Asset builder: " + err});

                resize(path.join(outputDir, options.name), options);
              }));
            } else {
              resize(path.join(appDir, output, type, options.name), options);
            }
          });
        }));
      }
    });
  });
}

Plugin.registerSourceHandler("assets", buildAssets);