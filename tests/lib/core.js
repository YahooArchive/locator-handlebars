/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */


/*jslint nomen:true, node:true */
/*globals describe,it */
"use strict";


var libpath = require('path'),
    expect = require('chai').expect,
    core = require('../../lib/core.js'),
    HB = require('yui/handlebars').Handlebars,
    fixturesPath = libpath.join(__dirname, '../fixtures');

describe('locator-handlebars', function () {

    describe('core', function () {

        it('partials', function () {
            var result = core.partials(fixturesPath + '/testfile.handlebars', HB);
            expect(result[0]).to.equal('baz');
            expect(result[1]).to.equal('abcd');
        });

        it('partialsdefault', function () {
            var result = core.partials(fixturesPath + '/testfile.hbs', HB);
            expect(result.length).to.equal(0);
        });

        it('compile', function () {
            var result = core.compile(fixturesPath + '/testfile.hb', null, HB);
            expect(JSON.stringify(result).substring(1, 9)).to.equal('function');
        });
    });

});
