/*jslint node:true, nomen: true*/

'use strict';

var express = require('express'),
    YUI = require('express-yui'),
    Locator = require('locator'),
    LocatorHandlebars = require('locator-handlebars'),
    handlebars = require('handlebars'), // let's use wycats's handlebars
    app = express();

YUI.extend(app);
app.yui.setCoreFromAppOrigin();

app.yui.applyGroupConfig({ // FIXME does not override yui's handlebars-base
    'handlebars-base': {
        async: false,
        modules: {
            'handlebars-base': {
                fullpath: __dirname + '/node_modules/handlebars'
            }
        }
    }
});

// custom view engine to rely on yui templates
app.set('view', app.yui.view({
    defaultBundle: 'demo',
    defaultLayout: 'layout'
}));

// serving static yui modules
app.use(YUI['static']());

// creating a page with YUI embeded
app.get('/', YUI.expose(), function (req, res, next) {
    res.render('bar', {
        tagline: 'testing with some data for template bar at the server side',
        bundle: 'demo',
        layout: 'layout'
    });
});

// locator initialiation
new Locator({
        buildDirectory: 'build'
    })

    .plug(LocatorHandlebars.yui({
        handlebars: handlebars // wycats's handlebars, not yui/handlebars
    }))

    .plug(app.yui.plugin({
        registerGroup: true,
        registerServerModules: true
    }))

    .parseBundle(__dirname, {})

    .then(function () {

        // listening for traffic only after locator finishes the walking process
        app.listen(3000, function () {
            console.log("Server listening on port 3000");
        });

    }, function (err) {
        console.error(err);
        console.error(err.stack);
    });
