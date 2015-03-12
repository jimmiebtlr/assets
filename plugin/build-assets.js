var fs = Npm.require('fs'), 
    gm = Npm.require('gm'),
    mkdirp = Npm.require('mkdirp'),
    appDir = this.process.env.PWD;

var types = [];

types.ios = {
  "sourceRequirements":       { size: 1024 },
  "Icon-60.png":              { size: 60 },
  "Icon-60@2x.png":           { size: 120 },
  "Icon-60@3x.png":           { size: 180 },
  "Icon-72.png":              { size: 72 },
  "Icon-72@2x.png":           { size: 144 },
  "Icon-76.png":              { size: 76 },
  "Icon-76@2x.png":           { size: 152 },
  "Icon-76@3x.png":           { size: 228 },
  "Icon-Small-50.png":        { size: 50 },
  "Icon-Small-50@2x.png":     { size: 100 },
  "Icon-Small.png":           { size: 29 },
  "Icon-Small@2x.png":        { size: 58 },
  "Icon-Small@3x.png":        { size: 87 },
  "Icon-Spotlight-40.png":    { size: 40 },
  "Icon-Spotlight-40@2x.png": { size: 80},
  "Icon-Spotlight-40@3x.png": { size: 120 },
  "Icon.png":                 { size: 57 },
  "Icon@2x.png":              { size: 114 },
  "iTunesArtwork":            { size: 512 },
  "iTunesArtwork@2x":         { size: 1024 }
}

types.favicon = {
  "favicon.png":                              { size: 32 },
  "apple-touch-icon-72x72-precomposed.png":   { size: 72 },
  "favicon.png":                              { size: 96 },
  "apple-touch-icon-120x120-precomposed.png": { size: 120 },
  "pinned.png":                               { size: 144 },
  "apple-touch-icon-152x152-precomposed.png": { size: 152 },
  "favicon-coast.png":                        { size: 228 }
}


var buildAssets = function (compileStep) {
  var config = JSON.parse(compileStep.read().toString('utf8'));

  _.each(config, function (options, name) {
    var options = _.extend({
      output: "resources"
    }, options), type, source;

    // Type
    if (typeof options.type === 'undefined') {
      compileStep.error({message: "Asset builder: No type provided for " + name});
    }
    type = options.type;

    // Source
    if (typeof options.source === 'undefined') {
      compileStep.error({message: "Asset builder: No source provided for " + name});
    }
    source = options.source;

    // Output
    output = options.output;

    _.each(type, function (type) {
      var images = types[type];

      if (images) {
        if (images.sourceRequirements) {
          var requirements = images.sourceRequirements;
          delete images.sourceRequirements;

          // Square Images
          if (requirements.size) {
            requirements.width = requirements.height = requirements.size;
          }

          gm(appDir + "/" + source).size(Meteor.bindEnvironment(function (err, size) {
            if (!err){
              if (size.width != requirements.width || size.height != requirements.height)
                compileStep.error({message: "Asset builder: Source image needs to be " + requirements.height + "x" + requirements.width + " for type " + name});
            } else {
              compileStep.error({message: "Asset builder: " + err});
            }
          }));
        }

        mkdirp(appDir + '/' + output + "/" + type + "/", Meteor.bindEnvironment(function (err) {
          if (err)
            compileStep.error({message: "Asset builder: " + err});

          _.each(images, function (options, name) {

            // Square Images
            if (options.size) {
              options.width = options.height = options.size;
            }

            gm(appDir + "/" + source)
              .resize(options.height, options.width)
              .write(appDir + '/' + output + "/" + type + "/" + name, Meteor.bindEnvironment(function (err) {
                if (err)
                  compileStep.error({message: "Asset builder: " + err});
              }));
          });
        }));
      }
    });
  });
}

Plugin.registerSourceHandler("assets", buildAssets);