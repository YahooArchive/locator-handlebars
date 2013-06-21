/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

var core = require('./core'),
    libpath = require('path');

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
            source_path = file.fullPath,
            bundleName = file.bundleName,
            name,
            destination_path;

        // building the name of the module based on:
        // * bundle name, partial or template denomination, and filename
        name = [
            bundleName,
            core.isPartial(source_path, this.describe.partialDir) ? 'partial' : 'template',
            libpath.basename(file.relativePath, '.' + file.ext)
        ].join('-');
        // destination is not very relevant, just dropping the file in buildDirectory
        destination_path = name + '.js';

        return api.promise(function (fulfill, reject) {

            var compiled,
                partials;

            try {
                partials = core.partials(source_path);
                compiled = core.compile(source_path, options);
            } catch (e) {
                reject(e);
            }

            // trying to write the destination file which will fulfill or reject the initial promise
            api.writeFileInBundle(bundleName, destination_path,
                self._wrapAsYUI(bundleName, name, compiled, partials))
                .then(function () {
                    // provisioning the module to be used on the server side automatically
                    evt.bundle.useServerModules = evt.bundle.useServerModules || [];
                    evt.bundle.useServerModules.push(name);
                    // we are now ready to roll
                    fulfill();
                }, reject);

        });

    },

    _wrapAsYUI: function (bundleName, name, compiled, partials) {

        // base dependency
        var dependencies = ["handlebars-base"],
            partialPrefix = bundleName + '-partial-';

        // each partial should be provisioned thru another yui module
        // and the name of the partial should translate into a yui module
        // to become a dependency
        partials = partials || [];
        partials.forEach(function (name) {
            // adding prefix to each partial
            dependencies.push(partialPrefix + name);
        });

        return [
            'YUI.add("' + name + '",function(Y, NAME){',
            '   var fn = Y.Template.Handlebars.revive(' + compiled + '),',
            '       cache = Y.Template._cache = Y.Template._cache || {},',
            '       partials = {};',
            '',
            '   Y.Array.each(' + JSON.stringify(partials) + ', function (name) {',
            '       cache["' + partialPrefix + '" + name] && (partials[name] = cache["' + partialPrefix + '" + name]);',
            '   });',
            '',
            '   cache[NAME] = function (data) {',
            '       return fn(data, {',
            '           partials: partials',
            '       });',
            '   };',
            '}, "", {requires: ' + JSON.stringify(dependencies) + '});'
        ].join('\n');

    }

};