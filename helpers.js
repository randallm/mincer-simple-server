var path = require('path');
var fs = require('fs');

module.exports = {
  argv: {},
  environment: {},

  absoluteBuildDir: function() {
    return path.join(this.argv.root, this.argv.buildDir);
  },

  absoluteCacheDir: function() {
    return path.join(this.absoluteBuildDir(this.argv), 'cache');
  },

  getFileExtension: function(filename) {
    // path.extname doesn't work with compound extensions like 'app.js.coffee'
    return '.' + filename.split('.').slice(1).join('.');
  },

  writeAssetsToDisk: function(assets) {
    console.log('');
    console.log(new Date().toUTCString());

    assets.forEach((function(asset) {
      this.writeAssetToDisk(asset);
    }).bind(this));
  },

  writeAssetToDisk: function(asset) {
    file = path.basename(asset.pathname, this.getFileExtension(asset.pathname)) + '.js';
    filePath = path.join(this.absoluteBuildDir(this.argv), file);

    fs.writeFileSync(filePath, asset.source);
    console.log(file + ' (' + asset.digest + ') written to ' + filePath);

    var sourceMapsState = this.environment.getConfigurations().source_maps.state;
    if (sourceMapsState === 'enabled' && asset.sourceMap) {
      fs.writeFileSync(filePath + '.map', asset.sourceMap);
      console.log(file + '.map written to ' + filePath + '.map');
    }
  }
};
