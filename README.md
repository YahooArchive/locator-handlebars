locator-handlebars
==================

Handlebars template compiler for locator.

[![Build Status](https://travis-ci.org/yahoo/locator-handlebars.png?branch=master)](https://travis-ci.org/yahoo/locator-handlebars)

This component is a result of the integration between [YUI][] and [Locator][] component from Yahoo! to compile [Handlebars][]' templates into [YUI][] Modules that could be used on the server thru express and on the client thru [YAF][].

The beauty of this is that you will NOT need to download the full `handlebars` parser component or the template itself, instead you use YUI Loader to load modules that will provision the handlebars templates in a form of javascript functions ready to be execute to produce a html fragment.

[Handlebars]: http://handlebarsjs.com/
[Locator]: https://github.com/yahoo/locator
[YUI]: https://github.com/yui/yui3
[YAF]: http://yuilibrary.com/yui/docs/app/


Installation
------------

Install using npm:

```shell
$ npm install locator-handlebars
```

By installing the module in your express application folder, you should be able to use it thru [Locator][].


Usage
-----

### Integration with `locator` on the server side

Normally, you will plug the locator plugin exposed by `locator-handlebars` into the locator instance, and locator will be able to analyze every file in your express app, and it will compile any `*.hb`, `*.hbs` or `*.handlebars` into a YUI module that can be used thru `express-yui` for example. The example below describes how to use the yui plugin with locator:

```
var Locator = require('locator'),
    LocatorHandlebars = require('locator-handlebars'),
    loc = new Locator();

// using locator-handlebars yui plugin
loc.plug(LocatorHandlebars.yui());

// walking the filesystem for an express app
loc.parseBundle(__dirname, {});
```

#### Options

An options configuration object may be passed to the locator-handlebars plugin creation function `LocatorHandlebars.yui(options)`.

Properties that may be used include:
- `extensions` - array of string filename extensions to use to identify Handlebars template files. The default is `['hb', 'handlebars', 'hbs']`.
- `handlebars` - instance of handlebars to use server-side. Default is `require('yui/handlebars').Handlebars`.


### Server side with `express` and `express-yui`

You can try a working example here:

https://github.com/yahoo/locator-handlebars/tree/master/example

### Client side with `yui`

On the client side, any [Handlebars][] template will be accessible as well thru `yui` as a regular yui module. Here is an example:

```
app.yui.use('<package-name>-template-bar', function (Y) {

    var html = Y.Template._cache['<package-name>/bar']({
        tagline: 'testing with some data for template bar'
    });

});
```

In the example above, the `<package-name>` is the package name specified in the `package.json` for the npm package that contains the template, which is usually the express application. `bar` comes from `bar.handlebars` where the filename is used as the name to register the template under `Y.Template`. By using the yui module name, you will be able to invoke the render action to produce a html fragment.

_note: in the near future, `Y.Template.render()` will be the formal API instead of using the `_cache` object, which is protected._


Partials
--------

This component will support handlebars partials:

* A partial is just another template.

* If a template uses another template (in a form of partial) it will be added to the dependency tree and will be loaded automatically.

* The name used to register the template under `Y.Template` is based on the filename by default, but could be customized to avoid collisions.

If you want to use a different template name, you can write your own parser:

```
// using locator-handlebars yui plugin
loc.plug(LocatorHandlebars.yui({
    nameParser: function (source_path) {
        var libpath = require('path'),
            name = libpath.basename(source_path, libpath.extname(source_path));
        if (source_path.indexOf('partials') > 0) {
            name += '-partial';
        }
        return name;
    }
}));
```

In the example above, when trying to parse `/path/to/foo.hbs` it will return `foo`, but when trying to `/path/to/partials/bar.hbs` it will return `foo-partial`, that will avoid collisions while giving you full control over the name resolution for the compiled templates.

TODO
----

* Add `helpers` rehydration.


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/yahoo/locator-handlebars/blob/master/LICENSE.txt


Contribute
----------

See the [CONTRIBUTE file][] for info.

[CONTRIBUTE file]: https://github.com/yahoo/locator-handlebars/blob/master/CONTRIBUTE.md
