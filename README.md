locator-handlebars
==================

Handlebars template compiler for locator.

This component is a result of the integration between [YUI][] and [Locator][] component from Yahoo! to compile [Handlebars][]' templates into [YUI][] Modules that could be used on the server thru express and on the client thru [YAF][].

The beaufy of this is that you will NOT need to download the full `handlebars` parser component or the template itself, instead you use YUI Loader to load modules that will provision the handlebars templates in a form of javascript functions ready to be execute to produce a html fragment.

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

### Server side with `express` and `express-yui`

You can try a working example here:

https://github.com/yahoo/locator-handlebars/tree/master/example

### Client side with `yui`

On the client side, any [Handlebars][] template will be accessible as well thru `yui` as a regular yui module. Here is an example:

```
app.yui.use('<name-of-app>-templates-bar', function (Y) {

    Y.Template._cache['<name-of-app>/bar']({
        tagline: 'testing with some data for template bar'
    }, Y.one('#container'));

});
```

In the example above, the `<name-of-app>` is the name specified in the `package.json` for your express application, and the template `bar.handlebars` will be rendered under the `#container` selector.

_note: in the near future, `Y.Template.render()` will be the formal API instead of using the `_cache` object, which is protected._


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/yahoo/locator-handlebars/blob/master/LICENSE.txt


Contribute
----------

See the [CONTRIBUTE file][] for info.

[CONTRIBUTE file]: https://github.com/yahoo/locator-handlebars/blob/master/CONTRIBUTE.md
