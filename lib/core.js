/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

var HB = require('yui/handlebars').Handlebars,
    libfs = require('fs'),
    libpath = require('path');

module.exports = {

    isPartial: function (source_path, partialDir) {
        var dirname = libpath.dirname(source_path);

        partialDir = libpath.normalize(partialDir);
        return (dirname.indexOf(partialDir) === dirname.length - partialDir.length);
    },

    partials: function (source_path) {
        var source = libfs.readFileSync(source_path, 'utf8'),
            parsed = HB.parse(source),
            partials = [];

        function walk(program) {
            if (program && program.statements) {
                program.statements.forEach(function (st) {
                    if (st.type === 'partial' && st.partialName.name) {
                        partials.push(st.partialName.name);
                    } else if (st.program) {
                        // collecting partials from sub programs
                        walk(st.program);
                    }
                });
            }
        }
        // collecting partials from the parsed program
        walk(parsed);

        return partials;
    },

    compile: function (source_path, options) {
        var source = libfs.readFileSync(source_path, 'utf8');
        return HB.precompile(source, options);
    }

};
