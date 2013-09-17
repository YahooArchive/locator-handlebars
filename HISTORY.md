Locator Handlebars Change History
=================================

@NEXT@
------------------

* the plugin is now a class definition that can be extended easily.
* leverage `Y.Template.register()` and `Y.Template.get()`, available in yui@3.12.x.
* a compiled version of the template is provisioned under the bundle object for runtime on the server side.
* yui output format is now opt-in.
* example does not use `express-yui` anymore, instead it uses `express-view`.
* the `handlebars` component can be controlled from outside by providing a custom version of it when creating an instance of the plugin.

0.2.3 (2013-09-16)
------------------

* relaxing the yui dependency to support 3.x.

0.2.2 (2013-09-12)
------------------

* a handlebars instance may be passed to locator-handlebars in the "handlebars" property of it's options object, and it will be used for server-side compilation and rendering instead of YUI Handlebars.

0.2.1 (2013-07-22)
------------------

* yui is now locked down to 3.11.0

0.2.0 (2013-07-16)
------------------

* no more partials, just templates. partials are just regular templates
* adding hook to redefine the template name parser routine, in case you need more control to avoid naming conflicts

0.1.0 (2013-06-27)
------------------

* Initial release.
