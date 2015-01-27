
var config = require('../../config');
var macros = require('./macros');
var ui = require('../../ui');
var cwd = process.cwd();
var fs = require('fs');
var _ = require('lodash');

module.exports = function(path, options, func) {
    try {
        var filepath;
        var vmString;
        var glue;
        var uiConfig = ui.config(path);
        var module = uiConfig.module;
        var body = uiConfig.body;
        var layout = uiConfig.layout;
        var velocity = config.template.engine;
        uiConfig.__head = ui.util.getHead(uiConfig.__head, config.template.extension);
        uiConfig.__screen = ui.util.getScreen([module, body], config.template.extension);
        uiConfig.__foot = ui.util.getFoot(uiConfig.__foot, config.template.extension);
        filepath = ui.util.getLayout([cwd, module, layout], config.template.extension);
        try {
            glue = _.merge({ ui: uiConfig }, options);
            vmString = fs.readFileSync(filepath).toString();
            uiConfig.__script = velocity.render(uiConfig.__script, glue);
            func(null, velocity.render(vmString, glue, macros));
        } catch (e) {
        }
    } catch (err) {
        console.log(err);
        func(err);
    }
};