Package.describe({
  name: 'hybrid:asset-builder',
  summary: 'Resize and optimize images for web, mobile, and desktop (icons/retina/favicons/etc)',
  version: '0.2.0',
  git: 'https://github.com/meteorhybrid/asset-builder'
});

Package.registerBuildPlugin({
  name: "buildAssets",
  use: ['underscore@1.0.2', 'meteor'],
  sources: [
    'plugin/build-assets.js'
  ],
  npmDependencies: {
    "gm": "1.17.0", 
    "mkdirp": "0.5.0",
    "async": "0.9.0",
    "async-each-object": "0.0.2",
    "fs-extra": "0.16.5"
  }
});