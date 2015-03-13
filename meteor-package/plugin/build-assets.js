var path = Npm.require('path'),
    Assets = Npm.require('hybrid-assets'),
    appDir = this.process.env.PWD;

/**
 * Build Assets
 */
var buildAssets = function (compileStep) {

  // New asset builder 
  var assets = new Assets({
    config: compileStep.read().toString('utf8'),
    cachePath: path.join(appDir, '.meteor/local/assets-build'),
    rootDir: appDir
  });

  // Override error method 
  assets.error = function (message) {
    compileStep.error({message: obj});
  }

  // Run the builder
  assets.run();
}

Plugin.registerSourceHandler("assets", buildAssets);