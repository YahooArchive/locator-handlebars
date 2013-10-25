locator-handlebars
==================

Handlebars template compiler for [Locator][].

[![Build Status](https://travis-ci.org/yahoo/locator-handlebars.png?branch=master)](https://travis-ci.org/yahoo/locator-handlebars)

`locator-handlebars` can be plugged into the [Locator][] component to compile
[Handlebars][] templates. These compiled templates could then be used both on
the server in an `express` application using [express-view][], and on the
client using your favorite module loader. `locator-handlebars` supports the
[YUI][] module format out of the box to be able to use the templates with
[YAF][], but can be extended to support any module format.

The beauty of this approach is that you will not need the handlebars parser nor
the handlebars template on the client. Instead, you use a module loader to
provision handlebars templates in the form of compiled templates (JavaScript
functions) that will produce HTML fragments upon execution.

[Handlebars]: http://handlebarsjs.com/
[Locator]: https://github.com/yahoo/locator
[YUI]: https://github.com/yui/yui3
[YAF]: http://yuilibrary.com/yui/docs/app/
[express-view]: https://github.com/yahoo/express-view


Installation
------------

Install using npm:

```shell
$ npm install locator-handlebars
```

By installing this module in your express application folder, you should be
able to use it as a [Locator][] plugin.


Usage
-----

### Integration with `locator`

By plugging an instance of `locator-handlebars` into a `locator` instance,
`locator` will be able to analyze and compile every `*.hb`, `*.hbs` or
`*.handlebars` file into memory, making them available to your application
through `express-view`.

Optionally, it will be able to compile it into the locator build folder using
one of the supported output formats. Today it supports `yui`, but it will
support `amd` and `es6` in the future as well.

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

This example explores how to use `locator-handlebars` on the server side with
`express` and `express-view`, while using `yui` on the client side as a medium
to load the compiled templates on demand to refresh parts of the page without
hitting the server to render the templates.

#### Configuration

A configuration object can be passed into the constructor to tweak the way the
plugin works.

Properties that may be used include:

* `format` - The output format in case you plan to use the templates from the
  client side.
* `handlebars` - Instance of handlebars to use server-side. Default is
  `require('yui/handlebars').Handlebars`.

Here is an example:

```
// using locator-handlebars plugin
loc.plug(new LocatorHandlebars({
    format: 'yui',
    handlebars: CustomHandlebarsEngine
}));
```

### Compiling to [YUI][] modules for client side

Optionally, if you plan to use the templates on the client side, you can
specify `format: "yui"`, and any [Handlebars][] template will be accessible
thru [YUI][] as a regular yui module. Here is an example of how to use them
from the client side:

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

In the example above, `<package-name>` and `<version>` correspond to the `name`
field and the `version` field specified in `package.json` for the npm package
that contains the template. This is usually the express application itself.
Then, `bar` comes from `bar.handlebars` where the filename without the
extension is used as the name to register the template under `Y.Template`.
After `use`ing the YUI module, you will be able to invoke the render action to
produce a html fragment.


Partials
--------

This component supports handlebars partials:

* A partial is just another template.

* If a template uses another template (in the form of partial) it will be added
  to the dependency tree and will be loaded automatically.

* The name used to register the template under `Y.Template` is based on the
  filename by default, but can be customized to avoid collisions.

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

In the example above, when trying to parse `/path/to/foo.hbs` it will return
`foo`, but when trying to `/path/to/partials/bar.hbs` it will return
`foo-partial`. In this way, you have control over the naming resolution for
compiled templates and namespace collisions can be avoided.


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/yahoo/locator-handlebars/blob/master/LICENSE.txt


Contribute
----------

See the [CONTRIBUTE file][] for info.

[CONTRIBUTE file]: https://github.com/yahoo/locator-handlebars/blob/master/CONTRIBUTE.md
