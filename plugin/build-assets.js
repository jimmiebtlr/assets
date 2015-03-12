var fs = Npm.require('fs'), 
    gm = Npm.require('gm'),
    mkdirp = Npm.require('mkdirp'),
    appDir = this.process.env.PWD;

var types = [];

types.ios = {
  "sourceRequirements": {
    height: 1024,
    width: 1024 
  },
  "Icon-60.png": {
    height: 60,
    width: 60
  },
  "Icon-60@2x.png": {
    height: 120,
    width: 120
  },
  "Icon-60@3x.png": {
    height: 180,
    width: 180
  },
  "Icon-72.png": {
    height: 72,
    width: 72
  },
  "Icon-72@2x.png": {
    height: 144,
    width: 144
  },
  "Icon-76.png": {
    height: 76,
    width: 76
  },
  "Icon-76@2x.png": {
    height: 152,
    width: 152
  },
  "Icon-76@3x.png": {
    height: 228,
    width: 228
  },
  "Icon-Small-50.png": {
    height: 50,
    width: 50
  },
  "Icon-Small-50@2x.png": {
    height: 100,
    width: 100
  },
  "Icon-Small.png": {
    height: 29,
    width: 29
  },
  "Icon-Small@2x.png": {
    height: 58,
    width: 58
  },
  "Icon-Small@3x.png": {
    height: 87,
    width: 87
  },
  "Icon-Spotlight-40.png": {
    height: 40,
    width: 40
  },
  "Icon-Spotlight-40@2x.png": {
    height: 80,
    width: 80
  },
  "Icon-Spotlight-40@3x.png": {
    height: 120,
    width: 120
  },
  "Icon.png": {
    height: 57,
    width: 57
  },
  "Icon@2x.png": {
    height: 114,
    width: 114
  },
  "iTunesArtwork": {
    height: 512,
    width: 512
  },
  "iTunesArtwork@2x": {
    height: 1024,
    width: 1024
  }
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