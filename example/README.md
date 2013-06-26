What is this example?
---------------------

This examples demonstrate how to use `locator-handlebars` in an express application that relies on `locator` and `express-yui` to render a page. It also demonstrate how to use a main layout for the page while relying on another handlebars template for the main area of the page (aka `outlet`).


How does it work?
-----------------

There are two templates in this example, `templates/bar.handlebars` and `templates/layout.handlebars`. They work together to form a composite view where `bar` will be inserted within a `div` in `layout`'s `outlet` entry.

But when the page gets rendered on the client side, the `app` can use yui to load a compiled version of `bar` on-demand, and call for render, producing a html fragment that can be inserted in the DOM.


How to test this app?
---------------------

First, install the demo dependencies, then run the express application:

```
npm install
node app.js
```

Then navigate to:

* `http://localhost:3000/`

