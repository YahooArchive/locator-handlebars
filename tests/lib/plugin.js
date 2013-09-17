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
    plugin = require('../../lib/plugin.js'),
    libpromise  = require('yui/promise');

describe('locator-handlebars', function () {

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
            file.fullPath = libpath.join(__dirname, '../fixtures/testfile.handlebars');
            api.promise = function (fn) {
                return new libpromise.Promise(fn);
            };
            file.fullPath = libpath.join(__dirname, '../fixtures/testfile.handlebars');
            api.writeFileInBundle =  function (bundleName, relativePath, contents, options) {
                filecall += 1;
                expect(bundleName).to.equal("testing");
                expect(relativePath).to.equal("testing-template-testfile.js");
                expect(contents.substring(0, 54)).to.equal("YUI.add(\"testing-template-testfile\",function(Y, NAME)");
                return new libpromise.Promise(function (fulfill, reject) {
                    fulfill();
                });
            };
            plugin.fileUpdated(evt, api).then(function () {
                try {
                    expect(1).to.equal(filecall);
                    expect(evt.bundle.useServerModules[0]).to.equal('testing-template-testfile');
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
                plugin.fileUpdated(evt, api);
            }).to.throw(Error);
        });
    });

});
