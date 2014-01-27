/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

var libfs = require('fs'),
    libpath = require('path'),
    HB = require('yui/handlebars').Handlebars,
    description = require('../package.json').description;

function PluginClass(config) {

    config = config || {};
    config.handlebars = config.handlebars || HB;

    this.describe = {
        summary: description,
        extensions: ['hb', 'handlebars', 'hbs'],
        options: config
    };

}

PluginClass.prototype = {

    nameParser: function (source_path) {
        return libpath.basename(source_path, libpath.extname(source_path));
    },

    partialsParser: function (source) {
        var parsed = this.describe.options.handlebars.parse(source),
            partials = [];

        function walk(program) {
            if (program && program.statements) {
                program.statements.forEach(function (st) {
                    if (st.type === 'partial' && st.partialName.name) {
                        partials.push(st.partialName.name);
                    } else if (st.program || st.inverse) {
                        if (st.program){
                            // collecting partials from sub programs
                            walk(st.program);
                        }
                        if (st.inverse){
                            // collecting partials from sub programs in conditional branches
                            walk(st.inverse);
                        }
                    }
                });
            }
        }
        // collecting partials from the parsed program
        walk(parsed);

        return partials;
    },

    fileUpdated: function (evt, api) {
        var self = this,
            bundle = evt.bundle,
            options = this.describe.options,
            handlebars = this.describe.options.handlebars,
            file = evt.file,
            source_path = file.fullPath,
            bundleName = file.bundleName,
            templateName = this.nameParser(source_path),
            moduleName = bundleName + '-template-' + templateName,
            destination_path = moduleName + '.js',
            format = this.describe.options.format;

        return api.promise(function (fulfill, reject) {

            var source = libfs.readFileSync(source_path, 'utf8'),
                precompiled,
                compiled,
                partials;

            try {
                partials = self.partialsParser(source);
                precompiled = handlebars.precompile(source, options);
                compiled = handlebars.compile(source, options);
            } catch (e) {
                throw new Error('Error parsing handlebars template: ' +
                        file.relativePath + '. ' + e);
            }

            // provisioning the template entries for server side use
            // in a form of a compiled function
            bundle.template = bundle.template || {};
            bundle.template[templateName] = function (data) {
                // this is to pipe all available templates in the
                // same bundle in a form of partials
                return compiled.apply(this, [data, {
                    partials: bundle.template
                }]);
            };

            if (format) {
                // trying to write the destination file which will fulfill or reject the initial promise
                api.writeFileInBundle(bundleName, destination_path,
                    require('./formats/' + format)(bundleName, templateName, moduleName, precompiled, partials))
                    .then(fulfill, reject);
            } else {
                fulfill();
            }

        });

    }

};

module.exports = PluginClass;
