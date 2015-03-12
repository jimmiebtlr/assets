# Hybrid Asset Builder

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/meteorhybrid/platform?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Resize and optimize images for web, mobile, and desktop.

### Installation

First download and install [GraphicsMagick](http://www.graphicsmagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:
```
brew install graphicsmagick
```

Install Meteor build plugin
```
meteor add hybrid:asset-builder
```

### Image Optimization
* [x] **Resizing** 
* [x] **Retina Images** - Generates a `@2x` and regular version of the image.
* [x] **Image Quality Adjustment** - Good for lowering filesize of larger images. 

### Platform Icons Supported
* [x] **Favicons + (iOS/Windows Pin Icons)** - favicon 
* [x] **iOS** - ios
* [x] **Android** - android
* [x] **Mac OS X** - mac
* [ ] **Windows Phone** - windows-phone
* [ ] **Windows** - windows-8
* [ ] **Chrome Extension** - chrome-ext
* [ ] **Chrome App** - chrome-app
* [ ] **Google TV** - google-tv
* [ ] **Blackberry** - blackberry

### Platform Splashscreens Supported
* [ ] **iOS** - ios-splash
* [ ] **Android** - android-splash
* [ ] **Windows Phone** - windows-phone-splash
* [ ] **Blackberry** - blackberry-splash

### Other Posible Features
* [ ] **Automatic CDN Uploading**

### Assets Config
Make a new file in your Meteor app directory called `config.assets`

Example Assets Config
```json
{
    "appIcons": {
        "source": "private/icon.png",
        "output": "resources/icons/",
        "type": ["ios", "android", "chrome-ext", "mac"]
    },
    "webIcons": {
        "source": "private/icon.png",
        "output": "public/assets/images/favicon/",
        "type": ["favicon"]
    },
    "webImages": {
        "source": [
            "private/image.jpg",
            "private/image2.jpg"
        ],
        "output": "public/assets/images/",
        "retina": true,
        "quality": 80
    },
    "customNameThumbnail": {
        "source": [
            "private/image.jpg"
        ],
        "name": "{{source}}-thumb.jpg",
        "output": "public/assets/images/",
        "height": 20,
        "width": 20,
        "retina": true,
        "quality": 40
    }
}
```

* **source** - Relative path to source image .
* **output** - Relative path of where to save the new images (will store in output/type/name if using a type).
* **type** - Array of types to include.
* **name** - Name of the outputed file. For an array of sources you can use `{{source}}` and it will automatically fill in the source file name here;
* **height** - Height of the (non-retina) image output.
* **width** - Width of the (non-retina) image output.
* **retina** - Include an @2x version of the image (this assumes the sources image is @2x).
* **quality** - Adjust the compression level. val ranges from 0 to 100 (best).

### Rerun Note
To avoid recreating images every time a file is changed during development, asset builder only reruns if `config.assets` changes or any of the source images referenced in it change.

### Source Icon
The source image for icon types should be a 1024x1024 `png` file. ([Example Source Icon](http://i.imgur.com/FWZofOo.png))

iOS generated icons from example
![iosoutput](http://i.imgur.com/gPGb4p7.png)

### Favicon Inclusion
If using the `favicon` type, include the assets in your `<head>`
```html
<!-- Standard Favicon -->
<link rel="icon" type="image/x-icon" href="/assets/images/favicon/favicon.png" />

<!-- For iPhone 4 Retina display: -->
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/assets/images/favicon/apple-touch-icon-114x114-precomposed.png">

<!-- For iPad: -->
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/assets/images/favicon/apple-touch-icon-72x72-precomposed.png">

<!-- For iPhone: -->
<link rel="apple-touch-icon-precomposed" href="/assets/images/favicon/apple-touch-icon-57x57-precomposed.png">

<!-- For Windows 8: -->
<meta name="msapplication-TileImage" content=“/assets/images/favicon/pinned.png”>
<meta name="msapplication-TileColor" content="#ef0303”>

<!-- For Opera Coast: -->  
<link rel="icon" href="/assets/images/favicon/favicon-coast.png" sizes="228x228">
```

![favicons](http://i.imgur.com/Rzrxoz4.png)

### Mobile Icons 
If using the `ios` or `android` types add these to your `mobile-config.js`
*Note: the icon in `mobile-config.js` are confusing and aren't actually all the icons you need. It's better to use the Xcode asset manager at this point* [#3153](https://github.com/meteor/meteor/issues/3153) [#3419](https://github.com/meteor/meteor/issues/3419)
```
App.icons({
  // iOS
  'iphone': 'resources/icons/ios/icon-60.png',
  'iphone_2x': 'resources/icons/ios/icon-60@2x.png',
  'iphone_3x': 'resources/icons/ios/icon-60@3x.png'
  'ipad': 'resources/icons/ios/icon-72.png',
  'ipad_2x': 'resources/icons/ios/icon-72@2x.png',

  // Android
  'android_hdpi': 'resources/icons/android/drawable-hdpi/ic_launcher.png',
  'android_ldpi': 'resources/icons/android/drawable-ldpi/ic_launcher.png',
  'android_mdpi': 'resources/icons/android/drawable-mdpi/ic_launcher.png',
  'android_xhdpi': 'resources/icons/android/drawable-xhdpi/ic_launcher.png',
  'android_xxhdpi': 'resources/icons/android/drawable-xxhdpi/ic_launcher.png',
  'android_xxxhdpi': 'resources/icons/android/drawable-xxxhdpi/ic_launcher.png',
});
```

### Retina Images
If generating retina images you may want to look into [retina.js](http://imulus.github.io/retinajs/) or use [css pixel ratio media queries](https://css-tricks.com/snippets/css/retina-display-media-query/).
