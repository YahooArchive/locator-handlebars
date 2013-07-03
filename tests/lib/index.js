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
    fixturesPath = libpath.join(__dirname, '../fixtures');

describe('locator-handlebars', function () {

    describe('plugin', function () {

        // we nee to write some tests here!
        it('partialDir', function () {
            expect(plugin.describe.partialDir).to.equal('./partials');
        });

    });

    describe('core', function () {

        it('isPartial', function () {
            var result = core.isPartial("../../lib", "../..");
            expect(result).to.equal(true);
        });

        it('isPartialnegative1', function () {
            var result = core.isPartial("../../lib", "../../lib");
            expect(result).to.equal(false);
        });

        it('isPartialnegative2', function () {
            var result = core.isPartial("../../lib", "../../lib/core.js");
            expect(result).to.equal(false);
        });

        it('partials', function () {
            var result = core.partials(fixturesPath + '/testfile.handlebars');
            expect(result[0]).to.equal('baz');
            expect(result[1]).to.equal('abcd');
        });

        it('compile', function () {
            var result = core.compile(fixturesPath + '/testfile.hb');
            expect(JSON.stringify(result).substring(1, 51)).to.equal('function (Handlebars,depth0,helpers,partials,data)');
        });
    });

});
