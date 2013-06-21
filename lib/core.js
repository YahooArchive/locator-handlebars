/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true, stupid: true */

"use strict";

var HB = require('yui/handlebars').Handlebars,
    libfs = require('fs'),
    libpath = require('path'),
    existsSync = libfs.existsSync || libpath.existsSync;

module.exports = {

    isPartial: function (source_path, partialDir) {
        var dirname = libpath.dirname(source_path);

        partialDir = libpath.normalize(partialDir);
        return (dirname.indexOf(partialDir) === dirname.length - partialDir.length);
    },

    parts: function (source_path, ext) {
        var parts = libpath.dirname(source_path).split(libpath.sep);
        parts.push(libpath.basename(source_path, ext ? '.' + ext : ext));
        return parts;
    },

    partials: function (source_path) {
        var source = libfs.readFileSync(source_path, 'utf8'),
            parsed = HB.parse(source),
            partials = [];
        if (parsed && parsed.statements) {
            parsed.statements.forEach(function (st) {
                if (st && st.type === 'partial' && st.partialName.name) {
                    partials.push(st.partialName.name);
                }
            });
        }
        return partials;
    },

    compile: function (source_path, options) {
        var source = libfs.readFileSync(source_path, 'utf8');
        return HB.precompile(source, options);
    }

};
