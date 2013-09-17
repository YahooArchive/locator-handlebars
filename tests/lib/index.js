/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */


/*jslint nomen:true, node:true */
/*globals describe,it */
"use strict";


var expect = require('chai').expect,
    Plugin = require('../../');

describe('locator-handlebars', function () {

    describe('index', function () {

        it('extend', function () {
            var a = {
                foo: 'bar'
            },
            extended = new Plugin(a);
            expect(extended.describe.options.foo).to.equal('bar');
        });

        it('extend default instance', function () {
            var extended = new Plugin();
            expect(extended.describe.summary).to.equal('Handlebars template compiler for locator');
        });

        it('YUI/handlebars used by default', function () {
            var extended = new Plugin(),

                expected = require('yui/handlebars').Handlebars,
                actual = extended.describe.options.handlebars;

            expect(actual).is.equal(expected);
        });

        it('custom handlebars is used in extended instance', function () {
            var fakeHb = {VERSION:'ohhai'},
                extended = new Plugin({handlebars: fakeHb}),

                expected = 'ohhai',
                actual = extended.describe.options.handlebars.VERSION;

            expect(actual).to.equal(expected);
        });

        it('extensions option default', function () {
            var extended = new Plugin(),

                expected = ['hb', 'handlebars', 'hbs'],
                actual = extended.describe.extensions;

            expect(actual).to.have.members(expected);
            expect(actual.length).to.equal(expected.length)
        });

    });

});
