/**
 * Assets Preset Types
 * --------------------------
 * Presets are Arrays containing the images to output from the source image
 *
 * @property {String} name              Filename of the exported image
 * @property {Number} size   (optional) The height and width of the exported image
 * @property {Number} height (optional) The height of the exported image
 * @property {Number} width  (optional) The width of the exported image
 * @property {Number} dir    (optional) The name of the directory to wrap the image in when exporting
 */
Presets = [];

// Favicon Preset
Presets.favicon = [
  { name: 'favicon.png',                              size: 32 },
  { name: 'apple-touch-icon-72x72-precomposed.png',   size: 72 },
  { name: 'apple-touch-icon-120x120-precomposed.png', size: 120 },
  { name: 'apple-touch-icon-152x152-precomposed.png', size: 152 },
  { name: 'pinned.png',                               size: 144 },
  { name: 'favicon-coast.png',                        size: 228 }
];

// iOS Icons Preset
Presets.ios = [
  { name: 'sourceRequirements',       size: 1024 },
  { name: 'Icon-60.png',              size: 60 },
  { name: 'Icon-60@2x.png',           size: 120 },
  { name: 'Icon-60@3x.png',           size: 180 },
  { name: 'Icon-72.png',              size: 72 },
  { name: 'Icon-72@2x.png',           size: 144 },
  { name: 'Icon-76.png',              size: 76 },
  { name: 'Icon-76@2x.png',           size: 152 },
  { name: 'Icon-76@3x.png',           size: 228 },
  { name: 'Icon-Small-50.png',        size: 50 },
  { name: 'Icon-Small-50@2x.png',     size: 100 },
  { name: 'Icon-Small.png',           size: 29 },
  { name: 'Icon-Small@2x.png',        size: 58 },
  { name: 'Icon-Small@3x.png',        size: 87 },
  { name: 'Icon-Spotlight-40.png',    size: 40 },
  { name: 'Icon-Spotlight-40@2x.png', size: 80},
  { name: 'Icon-Spotlight-40@3x.png', size: 120 },
  { name: 'Icon.png',                 size: 57 },
  { name: 'Icon@2x.png',              size: 114 },
  { name: 'iTunesArtwork',            size: 512 },
  { name: 'iTunesArtwork@2x',         size: 1024 }
];

// Android Icons Preset
Presets.android = [
  { name:'ic_launcher.png',    size: 72,  dir: 'drawable-hdpi' },
  { name:'ic_launcher.png',    size: 36,  dir: 'drawable-ldpi' },
  { name:'ic_launcher.png',    size: 48,  dir: 'drawable-mdpi' },
  { name:'ic_launcher.png',    size: 96,  dir: 'drawable-xhdpi' },
  { name:'ic_launcher.png',    size: 144, dir: 'drawable-xxhdpi' },
  { name:'ic_launcher.png',    size: 192, dir: 'drawable-xxxhdpi' },
  { name:'playstore-icon.png', size: 512  }
];

// Mac OS X Icons Preset
Presets.mac = [
  { name:'Icon_16x16.png',      size: 16 },
  { name:'Icon_16x16@2x.png',   size: 32 },
  { name:'Icon_16x16@3x.png',   size: 48 },
  { name:'Icon_32x32.png',      size: 32 },
  { name:'Icon_32x32@2x.png',   size: 64 },
  { name:'Icon_32x32@3x.png',   size: 96 },
  { name:'Icon_128x128.png',    size: 128 },
  { name:'Icon_128x128@2x.png', size: 256 },
  { name:'Icon_128x128@3x.png', size: 384 },
  { name:'Icon_256x256.png',    size: 256 },
  { name:'Icon_256x256@2x.png', size: 512 },
  { name:'Icon_256x256@3x.png', size: 768 },
  { name:'Icon_512x512.png',    size: 512 },
  { name:'Icon_512x512@2x.png', size: 1024 },
  { name:'Icon_512x512@3x.png', size: 1536 }
];

// Chrome Homescreen Installed App Icons Preset
Presets['chrome-homescreen'] = [
  { name:'launcher-icon-0-75x.png',  size: 36 },
  { name:'launcher-icon-1x.png',     size: 48 },
  { name:'launcher-icon-1-5x.png',   size: 72 },
  { name:'launcher-icon-2x.png',     size: 96 },
  { name:'launcher-icon-3x.png',     size: 144 },
  { name:'launcher-icon-4x.png',     size: 192 }
];

// Chrome App Icons Preset
Presets['chrome-app'] = [
  { name:'icon16.png',   size: 16 },
  { name:'icon32.png',   size: 32 },
  { name:'icon48.png',   size: 48 },
  { name:'icon128.png',  size: 128 }
];

// Chrome Extension Icons Preset
Presets['chrome-ext'] = [
  { name:'icon19.png',   size: 19 },
  { name:'icon38.png',   size: 38 },
  { name:'icon48.png',   size: 48 },
  { name:'icon128.png',  size: 128 }
];

// Windows 8.1 App Presets
Presets['windows-81'] = [
  { name:'LegacyLogo_16x16.png',      width: 16,   height: 16 },
  { name:'LegacyLogo_24x24.png',      width: 24,   height: 24 },
  { name:'LegacyLogo_32x32.png',      width: 32,   height: 32 },
  { name:'LegacyLogo_48x48.png',      width: 48,   height: 48 },
  { name:'LegacyLogo_56x56.png',      width: 56,   height: 56 },
  { name:'LegacyLogo_70x70.png',      width: 70,   height: 70 },
  { name:'LegacyLogo_98x98.png',      width: 98,   height: 98 },
  { name:'LegacyLogo_126x126.png',    width: 126,  height: 126 },
  { name:'LegacyLogo_248x248.png',    width: 248,  height: 248 },
  { name:'LegacyLogo_256x256.png',    width: 256,  height: 256 },
  { name:'LegacyLogo_310x310.png',    width: 310,  height: 310 },
  { name:'LegacyLogo_434x434.png',    width: 434,  height: 434 },
  { name:'LegacyLogo_558x558.png',    width: 558,  height: 558 },

  { name:'WideLogo_248x120.png',      width: 248,  height: 120 },
  { name:'WideLogo_310x150.png',      width: 310,  height: 150 },
  { name:'WideLogo_434x210.png',      width: 248,  height: 210 },
  { name:'WideLogo_558x270.png',      width: 248,  height: 270 },

  { name:'BadgeLogo_24x24.png',       width: 24,   height: 24 },
  { name:'SmallLogo_30x30.png',       width: 30,   height: 30 },
  { name:'StoreLogo_50x50.png',       width: 50,   height: 50 },
  { name:'SquareLogo_70x70.png',      width: 70,   height: 70 },
  { name:'SquareLogo_150x150.png',    width: 150,  height: 150 },
  { name:'SquareLogo_310x310.png',    width: 310,  height: 310 },
  { name:'Splashscreen_620x300.png',  width: 620,  height: 300 }
];


// Chrome Extension Previews Preset
Presets['chrome-ext-preview'] = [
  { name:'preview440x280.png',   width: 440,  height: 280 },
  { name:'preview920x680.png',   width: 920,  height: 680 },
  { name:'preview1400x560.png',  width: 1400, height: 560 }
];


// Custom Type Handling
Presets.custom = [{ custom: true }];

module.exports = Presets;
