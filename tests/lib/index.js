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
            var file = { bundleName: 'testing' },
                bundle = { name: 'testing' },
                evt = { file: file, bundle: bundle },
                api = {},
                filecall = 0;
            file.fullPath = libpath.join(__dirname, '../fixtures/testapp/testfile.handlebars');
            api.promise = function (fn) {
                return new libpromise.Promise(fn);
            };
            file.fullPath = libpath.join(__dirname, '../fixtures/testapp/testfile.handlebars');
            api.writeFileInBundle =  function (bundleName, relativePath, contents, options) {
                filecall += 1;
                expect(bundleName).to.equal("testing");
                expect(relativePath).to.equal("testing-templates-testfile.js");
                expect(contents.substring(0, 54)).to.equal("YUI.add(\"testing-templates-testfile\",function(Y, NAME)");
                return new libpromise.Promise(function (fulfill, reject) {
                    fulfill();
                });
            };
            plugin.fileUpdated(evt, api).then(function () {
                try {
                    expect(1).to.equal(filecall);
                    expect(evt.bundle.useServerModules[0]).to.equal('testing-templates-testfile');
                    next();
                } catch (err) {
                    next(err);
                }
            }, next);
        });

        it('fileUpdated1', function (next) {
            var file = { bundleName: 'testing' },
                bundle = { name: 'testing' },
                evt = { file: file, bundle: bundle },
                api = {},
                filecall = 0;
            file.fullPath = libpath.join(__dirname, '../fixtures/testapp/testnofile.handlebars');
            api.promise = function (fn) {
                return new libpromise.Promise(fn);
            };
            api.writeFileInBundle =  function (bundleName, relativePath, contents, options) {
                filecall += 1;
                return new libpromise.Promise(function (fulfill, reject) {
                    fulfill();
                });
            };
            plugin.fileUpdated(evt, api).then(function () {
                try {
                    expect(filecall).to.equal(0);
                    next();
                } catch (e) {
                    next(e);
                }
            }, function (err) {
                try {
                    expect(err.message.substring(0, 33)).to.equal("ENOENT, no such file or directory");
                    next();
                } catch (e) {
                    next(e);
                }
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
