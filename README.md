# Hybrid Asset Builder

Resize and optimize assets for web, mobile, and desktop.

### Installation

First download and install [GraphicsMagick](http://www.graphicsmagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:
```
brew install graphicsmagick
```

Install Meteor build plugin
```
meteor add hybrid:asset-builder
```

### Platform Icons Supported
* [x] **Favicon + (iOS/Windows Pin)** - favicon 
* [x] **iOS** - ios
* [ ] **Android** - android
* [ ] **Mac OS X** - mac
* [ ] **Windows Phone** - windows-phone
* [ ] **Windows 8** - windows-8
* [ ] **Chrome Extension** - chrome-ext
* [ ] **Chrome App** - chrome-app

### Platform Splashscreens Supported
* [ ] **iOS** - ios-splash
* [ ] **Android** - android-splash
* [ ] **Windows 8** - windows-8-splash

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
    }
}
```

* **source** - Relative path to source image 
* **output** - Relative path of where to store the resized icons (will store in output/type/name)
* **type** - Array of types to include

### Source Icon
To use the predefined icon types use a 1024x1024 pixel png file

Example Source Icon
![example](http://i.imgur.com/FWZofOo.png)

iOS Generated Icons
![iosoutput](http://i.imgur.com/gPGb4p7.png)

### Favicon Inclusion
If using the favicon type include the assets in your `<head>`
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

### TODO
* [ ] Allow for custom types / resizes
* [ ] Finish platform sizes
* [ ] Inline docs
* [ ] Type checks
* [ ] Finish documentation