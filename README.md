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
        "output": "resources/icons/",
        "type": ["web-app", "ios", "android", "chrome-extension", "mac"]
    }
}
```

* source - Relative path to source icon 
* output - Relative path of where to store the resized icons
* type - Array of types to include

### Source Icon
To use the predefined icon types use a 1024x1024 pixel png file

Example Source Icon
![example](http://i.imgur.com/Q4JK2uA.jpg)

iOS Generated Icons
![iosoutput](http://i.imgur.com/QYt68O3.png)

### TODO
* [ ] Allow for custom types / resizes
* [ ] Finish platform sizes
* [ ] Inline docs
* [ ] Type checks
* [ ] Finish documentation