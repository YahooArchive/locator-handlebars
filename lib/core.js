/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

var libfs = require('fs'),
    libpath = require('path');

module.exports = {

    name: function (source_path) {
        return libpath.basename(source_path, libpath.extname(source_path));
    },

    partials: function (source_path, HB) {
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

    compile: function (source_path, options, HB) {
        var source = libfs.readFileSync(source_path, 'utf8');
        return HB.precompile(source, options);
    }

};
