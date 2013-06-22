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
            treatItAsPartial = core.isPartial(source_path, this.describe.partialDir),
            templateName = libpath.basename(file.relativePath, '.' + file.ext),
            moduleName = bundleName + (treatItAsPartial ? '-partials-' : '-templates-') + templateName,
            destination_path = moduleName + '.js';

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
                self._wrapAsYUI(bundleName, templateName, moduleName, treatItAsPartial, compiled, partials))
                .then(function () {
                    // provisioning the module to be used on the server side automatically
                    evt.bundle.useServerModules = evt.bundle.useServerModules || [];
                    evt.bundle.useServerModules.push(moduleName);
                    // we are now ready to roll
                    fulfill();
                }, reject);

        });

    },

    _wrapAsYUI: function (bundleName, templateName, moduleName, isPartial, compiled, partials) {

        // base dependency
        var dependencies = ["handlebars-base"];

        // each partial should be provisioned thru another yui module
        // and the name of the partial should translate into a yui module
        // to become a dependency
        partials = partials || [];
        partials.forEach(function (name) {
            // adding prefix to each partial
            dependencies.push(bundleName + '-partials-' + name);
        });

        return [
            'YUI.add("' + moduleName + '",function(Y, NAME){',
            '   var fn = Y.Template.Handlebars.revive(' + compiled + '),',
            '       cache = Y.Template._cache = Y.Template._cache || {},',
            '       partials = {};',
            '',
            '   Y.Array.each(' + JSON.stringify(partials) + ', function (name) {',
            '       if (cache["' + bundleName + '/partials/' + '" + name]) {',
            '           partials[name] = cache["' + bundleName + '/partials/' + '" + name];',
            '       }',
            '   });',
            '',
            '   cache["' + bundleName + '/' + (isPartial ? 'partials/' : '') + templateName + '"] = function (data) {',
            '       return fn(data, {',
            '           partials: partials',
            '       });',
            '   };',
            '}, "", {requires: ' + JSON.stringify(dependencies) + '});'
        ].join('\n');

    }

};