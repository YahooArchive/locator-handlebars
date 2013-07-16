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
    plugin = require('../../lib/plugin.js');

describe('plugin', function () {

    describe('instance', function () {

        // we nee to write some tests here!
        it('summary', function () {
            expect(plugin.describe.summary).to.equal('Compile handlebars templates to yui modules');
        });

    });

});
