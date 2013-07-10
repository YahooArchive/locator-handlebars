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
    core = require('../../lib/core.js'),
    plugin = require('../../lib/plugin.js'),
    libpromise  = require('yui/promise'),
    Locator = require('locator'),
    fixturesPath = libpath.join(__dirname, '../fixtures');

describe('locator-handlebars', function () {

    describe('plugin', function () {

        it('partialDir', function () {
            expect(plugin.describe.partialDir).to.equal('./partials');
        });

        it('fileUpdated', function (next) {
            var locator = new Locator({});
            locator.plug(plugin).parseBundle(libpath.join(fixturesPath, 'testapp'), {}).then(function () {
                libfs.exists(libpath.join(fixturesPath, 'testapp/testapp-templates-testfile.js'), function (exists) {
                    expect(exists).to.equal(true);
                });
                libfs.exists(libpath.join(fixturesPath, 'testapp/testapp-partials-testfile.js'), function (exists) {
                    expect(exists).to.equal(true);
                });
                next();
            }, next);
        });
    });

    describe('core', function () {

        it('isPartial', function () {
            var result = core.isPartial("../fixtures/partials/testfile.hb", "../fixtures/partials");
            expect(result).to.equal(true);
        });

        it('isPartial1', function () {
            var result = core.isPartial("../fixtures/testfile.hb", "../fixtures");
            expect(result).to.equal(true);
        });

        it('isPartial2', function () {
            var result = core.isPartial("../fixtures", "../");
            expect(result).to.equal(true);
        });

        it('isPartialnegative', function () {
            var result = core.isPartial("../fixtures/", "../fixtures");
            expect(result).to.equal(false);
        });

        it('isPartialnegative1', function () {
            var result = core.isPartial("../fixtures/testfile.hb", "../fixtures/testfile.hb");
            expect(result).to.equal(false);
        });

        it('isPartialnegative2', function () {
            var result = core.isPartial("../fixtures", "../../fixtures/testfile.hb");
            expect(result).to.equal(false);
        });

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
