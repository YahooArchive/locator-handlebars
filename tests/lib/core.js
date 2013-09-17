/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */


/*jslint nomen:true, node:true */
/*globals describe,it */
"use strict";


var libfs = require('fs'),
    libpath = require('path'),
    expect = require('chai').expect,
    core = require('../../lib/core.js'),
    HB = require('yui/handlebars').Handlebars,
    fixturesPath = libpath.join(__dirname, '../fixtures');

describe('locator-handlebars', function () {

    describe('core', function () {

        it('partials', function () {
            var source = libfs.readFileSync(fixturesPath + '/testfile.handlebars', 'utf8'),
                result = core.partials(source, HB);
            expect(result[0]).to.equal('baz');
            expect(result[1]).to.equal('abcd');
        });

        it('partialsdefault', function () {
            var source = libfs.readFileSync(fixturesPath + '/testfile.hbs', 'utf8'),
                result = core.partials(source, HB);
            expect(result.length).to.equal(0);
        });
    });

});
