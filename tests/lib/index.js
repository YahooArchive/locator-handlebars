/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */


/*jslint nomen:true, node:true */
/*globals describe,it */
"use strict";


var expect = require('chai').expect,
    index = require('../../lib/index.js');
    
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

        it('extend default instance', function () {
            var extended = index.yui();
            expect(extended.describe.summary).to.equal('Compile handlebars templates to yui modules');
        });

    });

});
