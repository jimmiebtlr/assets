var path = Npm.require('path'),
    appDir = this.process.env.PWD;

/**
 * Build Assets
 */
var buildAssets = function (compileStep) {

  // New asset builder 
  assetBuilder = new AssetBuilder({
    config: compileStep.read().toString('utf8'),
    cachePath: path.join(appDir, '.meteor/local/assets-build'),
    rootDir: appDir
  });

  // Override error method 
  assetBuilder.error = function (message) {
    compileStep.error({message: obj});
  }

  // Run the builder
  assetBuilder.run();
}

Plugin.registerSourceHandler("assets", buildAssets);