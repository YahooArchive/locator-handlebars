/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */


/*jslint nomen:true, node:true */
/*globals describe,it */
"use strict";


var libpath = require('path'),
    libfs = require('fs'),
    mockery = require('mockery'),
    expect = require('chai').expect,
    assert = require('chai').assert,
    index = require('../../lib/index.js'),
    core = require('../../lib/core.js'),
    plugin = require('../../lib/plugin.js'),
    libpromise  = require('yui/promise'),
    Locator = require('locator'),
    fixturesPath = libpath.join(__dirname, '../fixtures');

describe('locator-handlebars', function () {

    describe('index', function () {

        it('extend', function () {
            var a = { 
                    foo: 'bar',
                    extensions: 'baz',
                    nameParser: 'test'
                },
                extended = index.yui(a);
            expect(extended.describe.summary).to.equal('Compile handlebars templates to yui modules');
            expect(extended.describe.extensions).to.equal('baz');
            expect(extended.describe.nameParser).to.equal('test');
            expect(extended.describe.foo).to.equal('bar');
        });
        
        it('extend1', function () {
            var extended = index.yui();
            expect(extended.describe.summary).to.equal('Compile handlebars templates to yui modules');
        });

    });

    describe('plugin', function () {

        it('summary', function () {
            expect(plugin.describe.summary).to.equal('Compile handlebars templates to yui modules');
        });

        it('fileUpdated', function (next) {
            var locator = new Locator({});
            locator.plug(plugin).parseBundle(libpath.join(fixturesPath, 'testapp'), {}).then(function () {
                libfs.exists(libpath.join(fixturesPath, 'testapp/testapp-templates-testfile.js'), function (exists) {
                    expect(exists).to.equal(true);
                });
                libfs.exists(libpath.join(fixturesPath, 'testapp/testapp-templates-testpartial.js'), function (exists) {
                    expect(exists).to.equal(true);
                });
                next();
            }, next);
        });
    });

    describe('core', function () {

        it('partials', function () {
            var result = core.partials(fixturesPath + '/testfile.handlebars');
            expect(result[0]).to.equal('baz');
            expect(result[1]).to.equal('abcd');
        });

        it('partialsdefault', function () {
            var result = core.partials(fixturesPath + '/testfile.hbs');
            expect(result.length).to.equal(0);
        });

        it('compile', function () {
            var result = core.compile(fixturesPath + '/testfile.hb');
            expect(JSON.stringify(result).substring(1, 9)).to.equal('function');
        });
    });

});
