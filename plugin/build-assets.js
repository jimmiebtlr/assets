var path = Npm.require('path'),
    appDir = this.process.env.PWD;

/**
 * Build Assets
 */
var buildAssets = function (compileStep) {

  // New asset builder 
  assetBuilder = new AssetBuilder({
    config: compileStep.read().toString('utf8'),
    cachePath: path.join(appDir, '.meteor/local/assets-build')
  });

  // Override error method 
  assetBuilder.error = function (message) {
    compileStep.error({message: obj});
  }

  // If config changes or source changes rerun the build.
  assetBuilder.checkConfigChanges(function (changes) {
    if (changes) {
      assetBuilder.build();
    } else {
      assetBuilder.checkSourceChanges(function (changes) {
        if (changes) {
          assetBuilder.build();
        } else {
          return;
        }
      })
    }
  });
}

Plugin.registerSourceHandler("assets", buildAssets);