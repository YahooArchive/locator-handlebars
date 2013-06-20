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

function getNameParts(bundleName, path, ext) {
    var parts = [bundleName];
    parts = parts.concat(libpath.dirname(path).split(libpath.sep));
    parts.push(libpath.basename(path, ext ? '.' + ext : ext));
    return parts;
}

module.exports = {

    describe: {
        summary: 'Compile handlebars templates to yui modules',
        extensions: ['hb', 'handlebars', 'hbs'],
        partialDir: 'partials'
    },

    fileUpdated: function (evt, api) {

        var self = this,
            options = this.describe.options  || {},
            file = evt.file,
            ext = file.ext,
            source_path = file.fullPath,
            relative_path = file.relativePath,
            bundleName = file.bundleName,
            name = getNameParts(bundleName, relative_path, ext).join('-'),
            id = getNameParts(bundleName, relative_path, ext).join('/'),
            destination_path = name + '.js',
            partialsDir = libpath.resolve(libpath.dirname(source_path), this.describe.partialDir),
            files,
            partials = {};

        // intentionally doing a sync routine here to read all partials
        if (existsSync(partialsDir)) {
            files = libfs.readdirSync(partialsDir);
            files.forEach(function (f) {
                if (libpath.extname(f).substring(1) !== ext) {
                    return;
                }
                partials[libpath.basename(f, '.' + ext)] = libfs.readFileSync(libpath.join(partialsDir, f), 'utf8');
            });
        }
console.log(444, files);
        return api.promise(function (fulfill, reject) {

            var compiled;
try {
            options.partials = partials;
            compiled = HB.precompile(libfs.readFileSync(source_path, 'utf8'), options);
} catch (e) {
    console.error(e);
}
console.log(555);
            // trying to write the destination file which will fulfill or reject the initial promise
            api.writeFileInBundle(bundleName, destination_path,
                self._wrapAsYUI(name, id, libpath.join(bundleName, relative_path), compiled))
                .then(function () {
                    // provisioning the module to be used on the server side automatically
                    evt.bundle.useServerModules = evt.bundle.useServerModules || [];
                    evt.bundle.useServerModules.push(name);
                    // we are now ready to roll
                    fulfill();
                }, reject);

        });

    },

    _wrapAsYUI: function (name, id, path, compiled) {

        return [
            'YUI.add("' + name + '",function(Y, NAME){',
            '   var fn = Y.Template.Handlebars.revive(' + compiled + '),',
            '       cache = Y.Template._cache = Y.Template._cache || {};',
            '   cache["' + path + '"] = cache[NAME] = cache["' + id + '"] = function (data) {',
            '       return fn(data);',
            '   };',
            '}, "", {requires: ["handlebars-base"]});'
        ].join('\n');

    }

};