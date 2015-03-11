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
* [ ] Web App
* [x] iOS
* [ ] Android
* [ ] Mac OS X
* [ ] Windows Phone
* [ ] Windows 8
* [ ] Chrome Extension
* [ ] Chrome App

### Assets Config
Make a new file in your Meteor app directory called `config.assets`

Example Assets Config
```json
{
    "appIcons": {
        "source": "private/icon.png",
        "output": "resources",
        "type": ["web-app", "ios", "android", "chrome-extension", "mac"]
    }
}
```

### TODO
* [ ] Allow for custom types / resizes
* [ ] Finish platform sizes