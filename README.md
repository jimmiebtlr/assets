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
* [ ] **Web App** - web-app
* [x] **iOS** - ios
* [ ] **Android** - android
* [ ] **Mac OS X** - mac
* [ ] **Windows Phone** - windows-phone
* [ ] **Windows 8** - windows-8
* [ ] **Chrome Extension** - chrome-ext
* [ ] **Chrome App** - chrome-app
* [ ] **Favicon** - favicon 

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
        "type": ["web-app", "ios", "android", "chrome-ext", "mac"]
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

### TODO
* [ ] Allow for custom types / resizes
* [ ] Finish platform sizes
* [ ] Inline docs
* [ ] Type checks
* [ ] Finish documentation