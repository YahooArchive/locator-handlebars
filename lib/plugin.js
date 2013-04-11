/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true, stupid: true */

"use strict";

var HB = require('yui/handlebars').Handlebars,
    fs = require('fs'),
    path = require('path'),
    existsSync = fs.existsSync || path.existsSync;

function getName(file, ext) {
    file = path.basename(file);
    return file.substring(0, file.length - ext.length - 1);
}

module.exports = {

    describe: {
        summary: 'Handlebars compiler plugin',
        extensions: ['hb', 'handlebars']
    },

    fileUpdated: function (meta, api) {

        var self = this,
            ext = meta.ext,
            source_path = meta.fullPath,
            name = getName(source_path, ext),
            bundleName = meta.bundleName,
            moduleName = bundleName + '-template-' + name,
            destination_path = path.join('yui-modules', moduleName, moduleName + '-debug.js'),
            partialsDir = path.join(path.dirname(source_path), 'partials'),
            files,
            partials = {};

        // intentionally doing a sync routine here to read all partials
        if (existsSync(partialsDir)) {
            files = fs.readdirSync(partialsDir);
            files.forEach(function (f) {
                if (path.extname(f).substring(1) !== ext) {
                    return;
                }
                partials[getName(f, ext)] = fs.readFileSync(path.join(partialsDir, f), 'utf8');
            });
        }

        return api.promise(function (fulfill, reject) {

            var compiled;

            try {

                compiled = HB.precompile(fs.readFileSync(source_path, 'utf8'), {
                    partials: partials
                });

                // trying to write the destination file which will fulfill or reject the initial promise
                api.writeFileInBundle(bundleName, destination_path,
                    self._wrapAsYUI(bundleName, name, compiled))
                    .then(fulfill, reject);

            } catch (e) {

                reject(new Error(source_path + ": Handlebars compiler error: " + e.message));

            }

        });

    },

    _wrapAsYUI: function (bundleName, templateName, compiled) {

        return [
            'YUI.add("' + bundleName + '-template-' + templateName + '",function(Y){',
            '   var bundle=Y.namespace("' + bundleName + '");',
            '   bundle.templates=bundle.templates||{};',
            '   bundle.templates["' + templateName + '"]=Y.Template.Handlebars.revive(' + compiled + ');',
            '}, "", {requires: ["handlebars-base"]});'
        ].join('\n');

    }

};