locator-handlebars
==================

Handlebars template compiler for locator.

[![Build Status](https://travis-ci.org/yahoo/locator-handlebars.png?branch=master)](https://travis-ci.org/yahoo/locator-handlebars)

This component can be integrated with [Locator][] component from Yahoo! to compile [Handlebars][]' templates. The compiled templates could be used on the server thru `express-view` and on the client thru a module loader depending on the format you decide to compile to, by default it supports [YUI][] format to be able to use the templates with [YAF][].

The beauty of this is that you will NOT need to download the full `handlebars` parser component or the template itself, instead you use a loader to load modules that will provision the handlebars templates in a form of javascript functions ready to be execute to produce a html fragment.

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

### Integration with `locator`

You can create an instance of the plugin and plug it into the locator instance, and locator will be able to analyze every file in your express app, and it will compile any `*.hb`, `*.hbs` or `*.handlebars` into memory, making them available thru `express-view`.

Optionally, it will be able to compile it into the locator build folder using one of the supported output `format` (for now it supports `yui`, but in the future will support `amd` and `es6` as well).

The example below describes how to use the plugin with locator:

```
var Locator = require('locator'),
    LocatorHandlebars = require('locator-handlebars'),
    loc = new Locator();

// using locator-handlebars plugin
loc.plug(new LocatorHandlebars());

// walking the filesystem for an express app
loc.parseBundle(__dirname, {});
```

### Integration with `express`, `express-view` and `yui`

You can try a working example here:

https://github.com/yahoo/locator-handlebars/tree/master/example

This example explores how to use `locator-handlebars` on the server side with `express` and `express-view`, while using `yui` on the client side as a medium to load the compiled templates on demand to refresh parts of the page without hitting the server to render the templates.

#### Configuration

A configuration object can be passed into the constructure to tweak the way the plugin works.


Properties that may be used include:

* `format` - the output format in case you plan to use the templates from the client side. For now, it only support `yui` format.
* `handlebars` - instance of handlebars to use server-side. Default is `require('yui/handlebars').Handlebars`.

Here is an example:

```
// using locator-handlebars plugin
loc.plug(new LocatorHandlebars({
    format: 'yui',
    handlebars: CustomHandlebarsEngine
}));
```

### Compiling to [YUI][] modules for client side

Optionally, if you plan to use the templates on the client side, you can specify `format: "yui"`, and any [Handlebars][] template will be accessible thru [YUI][] as a regular yui module. Here is an example of how to use them from the client side:

```
<script src="http://yui.yahooapis.com/3.12.0/build/yui/yui-debug.js"></script>
<script src="/static/path/to/build/<package-name>-<version>/<package-name>-template-bar.js"></script>
<script>
YUI().use('<package-name>-template-bar', function (Y) {

    var html = Y.Template.get('<package-name>/bar')({
        tagline: 'testing with some data for template bar'
    });

});
</script>
```

In the example above, the `<package-name>` is the package name specified in the `package.json` for the npm package that contains the template, which is usually the express application, the same for `<version>`. Then, `bar` comes from `bar.handlebars` where the filename is used as the name to register the template under `Y.Template`. By using the yui module name, you will be able to invoke the render action to produce a html fragment.


Partials
--------

This component supports handlebars partials:

* A partial is just another template.

* If a template uses another template (in a form of partial) it will be added to the dependency tree and will be loaded automatically.

* The name used to register the template under `Y.Template` is based on the filename by default, but could be customized to avoid collisions.

If you want to use a different template name, you can write your own parser:

```
var plugin = new LocatorHandlebars();
// using locator-handlebars yui plugin
loc.plug(plugin);

// monkey patch the plugin instance
plugin.nameParser = function (source_path) {
    var libpath = require('path'),
        name = libpath.basename(source_path, libpath.extname(source_path));
    if (source_path.indexOf('partials') > 0) {
        name += '-partial';
    }
    return name;
};
```

In the example above, when trying to parse `/path/to/foo.hbs` it will return `foo`, but when trying to `/path/to/partials/bar.hbs` it will return `foo-partial`, that will avoid collisions while giving you full control over the name resolution for the compiled templates.


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/yahoo/locator-handlebars/blob/master/LICENSE.txt


Contribute
----------

See the [CONTRIBUTE file][] for info.

[CONTRIBUTE file]: https://github.com/yahoo/locator-handlebars/blob/master/CONTRIBUTE.md
