var path = require('path');
var fs = require('fs');

module.exports = {
  root: null,
  buildDir: null,
  sourceMapsState: null,

  extendFromArgv: function(argv, keys) {
    keys.forEach(function(key) {
      this[key] = argv[key];
    }.bind(this));
  },

  absoluteBuildDir: function() {
    return path.join(this.root, this.buildDir);
  },

  absoluteCacheDir: function() {
    return path.join(this.absoluteBuildDir(), 'cache');
  },

  getFileExtension: function(pathname) {
    // path.extname doesn't work with compound extensions like 'app.js.coffee'
    var splitPathname = pathname.split('/');
    var filename = splitPathname[splitPathname.length - 1];

    return '.' + filename.split('.').slice(1).join('.');
  },

  writeAssets: function(assets) {
    console.log('');
    console.log(new Date().toUTCString());

    assets.forEach((function(asset) {
      this.writeAsset(asset);
    }).bind(this));
  },

  writeAsset: function(asset) {
    var file = path.basename(asset.pathname, this.getFileExtension(asset.pathname)) + '.js';
    var filePath = path.join(this.absoluteBuildDir(), file);

    fs.writeFileSync(filePath, asset.source);
    console.log(file + ' (' + asset.digest + ') written to ' + filePath);

    if (this.sourceMapsEnabled && asset.sourceMap) {
      fs.writeFileSync(filePath + '.map', asset.sourceMap);
    }
  }
};
