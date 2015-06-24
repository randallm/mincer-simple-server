# mincer-simple-server

Compile your [mincer](https://github.com/nodeca/mincer) assets as fast as idiomatically possible—just a `curl localhost` away.

mincer-simple-server supports out of the box:

- Source Maps
- CoffeeScript
- Haml Coffee Templates
- Persistent assets caching on the filesystem, through `Mincer.FileStore`

## Installation

```
$ npm install mincer-simple-server
```

## Usage

**Server**

``` sh
$ npm install
$ node serve.js --root /Users/randall/Workspace/project/ --include lib/assets/javascripts vendor/assets/javascripts --build_dir build --enable-source-maps --files application.js.coffee
```

Parameters:

- `--root` (String): `--include` and `--build-dir` are calculated against this value. Required.
- `--include` ([yargs.array](https://github.com/bcoe/yargs#arraykey)): Mincer load path directories. Required.
- `--build-dir` (String): Assets/maps/mincer cache are all built here. Required.
- `--enable-source-maps` (Boolean): Toggle source map generation on (at a performance hit). Optional, defaults to `false`.
- `--port` (String): Port the server listens on. Optional, defaults to `3000`.
- `--files` ([yargs.array](https://github.com/bcoe/yargs#arraykey)): Files in the Mincer load path to be processed. Required.

The first compile of an asset with a lot of `require` calls will take a long time (~20s on a 2014 MacBook Pro) because a cache will be built to `$build_dir/cache`.

**Client**

To mince assets:

```sh
$ curl -X PUT localhost:3000
```

To kill the server:

```
$ curl localhost:3000/exit
```

## Contributing :heart_eyes:

1. [Fork it](https://help.github.com/articles/fork-a-repo)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new [Pull Request](https://help.github.com/articles/using-pull-requests)

**Guidelines**

1. Keep things simple
  - The mincer API has support for a lot of features, including manifest files (to track asset hash changes) and built-in `connect` middleware...
  - ...but in lieu of using the aforementioned methods (`Manifest.compile` and `Server.compile`) to build assets, we call `Environment.findAsset`. It's a lower level method that spits out an `Asset` object in only one line, and it helps keep us out of callback hell.
2. Run `jshint` before you submit anything upstream
