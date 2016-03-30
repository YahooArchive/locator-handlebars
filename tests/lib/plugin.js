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
    expect = require('chai').expect,
    Plugin = require('../../'),
    libpromise  = require('yui/promise');

describe('locator-handlebars', function () {

    describe('plugin', function () {

        it('summary', function () {
            var p = new Plugin();
            expect(p.describe.summary).to.equal('Handlebars template compiler for locator');
        });

        it('fileUpdated', function (next) {
            var file = { bundleName: 'testing' },
                bundle = { name: 'testing' },
                evt = { file: file, bundle: bundle },
                api = {},
                filecall = 0;
            file.fullPath = libpath.join(__dirname, '../fixtures/testfile.handlebars');
            api.promise = function (fn) {
                return new libpromise.Promise(fn);
            };
            file.fullPath = libpath.join(__dirname, '../fixtures/testfile.handlebars');
            api.writeFileInBundle =  function (bundleName, relativePath, contents, options) {
                filecall += 1;
                expect(bundleName).to.equal("testing");
                expect(relativePath).to.equal("testing-tmpl-testfile.js");
                expect(contents.substring(0, 51)).to.equal("YUI.add(\"testing-tmpl-testfile\",function(Y, NAME) {");
                return new libpromise.Promise(function (fulfill, reject) {
                    fulfill();
                });
            };
            new Plugin({ format: 'yui', parsePartials: true }).fileUpdated(evt, api).then(function () {
                try {
                    expect(1).to.equal(filecall);
                    expect(evt.bundle.template['testfile']).to.be.a('function');
                    next();
                } catch (err) {
                    next(err);
                }
            }, next);
        });

        it('esm format', function (next) {
            var file = { bundleName: 'testing' },
                bundle = { name: 'testing' },
                evt = { file: file, bundle: bundle },
                api = {},
                filecall = 0;
            file.fullPath = libpath.join(__dirname, '../fixtures/testfile.handlebars');
            api.promise = function (fn) {
                return new libpromise.Promise(fn);
            };
            file.fullPath = libpath.join(__dirname, '../fixtures/testfile.handlebars');
            api.writeFileInBundle =  function (bundleName, relativePath, contents, options) {
                filecall += 1;
                expect(bundleName).to.equal("testing");
                expect(relativePath).to.equal("testing-tmpl-testfile.js");
                expect(contents.substring(0, 195)).to.equal([
                    "// @module testing-tmpl-testfile",
                    "import 'template-base';",
                    "import 'handlebars-base';",
                    "import 'testing-tmpl-baz';",
                    "import 'testing-tmpl-abcd';",
                    "import 'testing-tmpl-efgh';",
                    "import Y from 'yui-instance';"
                ].join('\n'));
                return new libpromise.Promise(function (fulfill, reject) {
                    fulfill();
                });
            };
            new Plugin({ format: 'esm', parsePartials: true }).fileUpdated(evt, api).then(function () {
                try {
                    expect(1).to.equal(filecall);
                    expect(evt.bundle.template['testfile']).to.be.a('function');
                    next();
                } catch (err) {
                    next(err);
                }
            }, next);
        });

        it('fileUpdated if file is an invalid template', function () {
            var file = { bundleName: 'testing', relativePath: '../fixtures/invalid.handlebars' },
                bundle = { name: 'testing' },
                evt = { file: file, bundle: bundle },
                api = {};
            file.fullPath = libpath.join(__dirname, file.relativePath);
            api.promise = function (fn) {
                return fn();
            };
            expect(function() {
                new Plugin().fileUpdated(evt, api);
            }).to.throw(Error);
        });
    });

});
