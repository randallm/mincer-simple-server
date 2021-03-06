var connect = require('connect');
var Mincer = require('mincer');
var fs = require('fs');
var mkdirp = require('mkdirp');
require('mincer-haml-coffee')(Mincer);

var helper = require('./helpers.js');

var argv = require('yargs')
  .array('include')
  .array('files')
  .argv;
helper.extendFromArgv(argv, ['root', 'buildDir']);

var environment = new Mincer.Environment(argv.root);
helper.environment = environment;
argv.include.forEach(function(dir) {
  environment.appendPath(dir);
});

var app = connect();

app.use('/exit', function(req, res, next) {
  console.log('Shutting down mincer-simple-server');
  res.writeHead(202, {});
  res.end();
  process.exit();
});

app.use(function(req, res, next) {
  if (req.method !== 'PUT') { return; }
  next();
});

app.use(function(req, res, next) {
  try {
    fs.lstatSync(argv.root);
  } catch (err) {
    console.error('Root directory ' + argv.root + ' does not exist');
  }
  next();
});

app.use(function(req, res, next) {
  try {
    fs.lstatSync(helper.absoluteBuildDir());
  } catch (err) {
    mkdirp.sync(helper.absoluteBuildDir());
    console.log('New directory ' + helper.absoluteBuildDir() + ' created');
  }

  next();
});

app.use(function(req, res, next) {
  // Undocumented, but public Mincer caching API:
  environment.cache = new Mincer.FileStore(helper.absoluteCacheDir());

  try {
    fs.lstatSync(helper.absoluteCacheDir());
  } catch (err) {
    environment.enable('source_maps');

    // The cache directory needs to be populated once with source map data. Then
    // source maps can be toggled on and off on subsequent runs. If this is not
    // called on first run, source maps cannot be generated.
    argv.files.forEach(function(file) {
      environment.findAsset(file);
    });
    environment.disable('source_maps');
  }

  next();
});

app.use(function(req, res, next) {
  if (argv.enableSourceMaps && argv.enableSourceMaps !== 'false') {
    environment.enable('source_maps');
    helper.sourceMapsEnabled = true;
  } else {
    environment.disable('source_maps');
    helper.sourceMapsEnabled = false;
  }

  next();
});

app.use(function(req, res, next) {
  var assets = argv.files.map(function(file) {
    return environment.findAsset(file);
  });

  helper.writeAssets(assets);

  res.writeHead(200, {});
  res.end();
});

var port = argv.port || 3000;
var server = app.listen(port);
console.log('mincer-simple-server is running on port ' + port);
