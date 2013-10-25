What is this example?
---------------------

This examples demonstrate how to use `locator-handlebars` in an express application that relies on `locator` and `express-view` to render a page. It also demonstrate how to use a main layout for the page while relying on another handlebars template for the main area of the page (aka `outlet`).


How does it work?
-----------------

There are three templates in this example, `templates/bar.handlebars`, `templates/partials/baz.handlebars` and `templates/layout.handlebars`. They work together to form a composite view where `bar` will be inserted within a `div` in `page`'s `outlet` entry, and `baz` will be treated as a partial template called from `page`.

But when the page gets executed on the browser, we can use a loader (e.g.: YUI Loader) to load a compiled version of `bar` on-demand, and call for render, producing a html fragment that can be inserted in the DOM.


How to test this app?
---------------------

First, clone and install the component.

```
git clone https://github.com/yahoo/locator-handlebars.git
cd locator-handlebars
npm install
```

Second, install the example dependencies:

```
cd example
npm install
```

Third, run the express application:

```
node app.js
```

Then navigate to:

* `http://localhost:3000/`
