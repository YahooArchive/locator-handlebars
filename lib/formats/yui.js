/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

module.exports = function (bundleName, templateName, moduleName, precompiled, partials) {

    // base dependency
    var dependencies = ["template-base", "handlebars-base"];

    // each partial should be provisioned thru another yui module
    // and the name of the partial should translate into a yui module
    // to become a dependency
    partials = partials || [];
    partials.forEach(function (name) {
        // adding prefix to each partial
        dependencies.push(bundleName + '-template-' + name);
    });

    return [
        'YUI.add("' + moduleName + '",function(Y, NAME){',
        '   var fn = Y.Template.Handlebars.revive(' + precompiled + '),',
        '       partials = {};',
        '',
        '   Y.Array.each(' + JSON.stringify(partials) + ', function (name) {',
        '       var fn = Y.Template.get("' + bundleName + '/" + name);',
        '       if (fn) {',
        '           partials[name] = fn;',
        '       }',
        '   });',
        '',
        '   Y.Template.register("' + bundleName + '/' + templateName + '", function (data) {',
        '       return fn(data, {',
        '           partials: partials',
        '       });',
        '   });',
        '}, "", {requires: ' + JSON.stringify(dependencies) + '});'
    ].join('\n');

};
