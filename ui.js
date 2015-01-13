// var sys = require('sys');

var fs = require('fs');
var _ = require('lodash');
var cwd = process.cwd();
var config = require('./config');
// default ui config
var uiConfig = {
    css: '',
    js: '',
    head: '',
    foot: '',
    page: {
        css: '',
        js: '',
        title: ''
    }
};

function inline(module, page) {
    var embed = {};
    var cssSource, jsSource;
    var path = 'views/ui/' + module + '/';
    try {
        cssSource = fs.readFileSync(path + page + '.css', 'utf-8');
        embed['__style'] = cssSource;
    } catch(e) {
        embed['__style'] = '';
    }
    try {
        jsSource = fs.readFileSync(path + page + '.js', 'utf-8');
        embed['__script'] = jsSource;
    } catch(e) {
        embed['__script'] = '';
    }
    return embed;
}

function getKey(path) {
    var __key;
    if (path && _.isString(path)) {
        __key = path.replace(/^.*[\\\/]templates[\\\/](.+)[\\\/]screen[\\\/](.+)\.vm$/, '$1,$2');
    }
    return __key;
}

function putOn(resource, type) {
    var str = '';
    if ('css' == type) {
        resource.forEach(function(item) {
            str += '<link rel="stylesheet" src="/assets/' + item + '" />\n';
        });
    } else if ('js' == type) {
        resource.forEach(function(item) {
            str += '<script src="/assets/' + item + '"></script>\n';
        });
    }
    return str;
}

function readJson(module) {
    var source;
    var path = module === undefined ?
                'views/ui/config' : 'views/ui/' + module;
    try {
        source = fs.readFileSync(path + '/config.json','utf-8');
        return JSON.parse( source );
    } catch(e) {
        return null;
        // throw new Error(e);
    }
}

function getModule(key) {
    return key ? key.split(',') : [];
}

function parseConfig(key) {
    var obj;
    var css, js;
    var i, j, k, tgc = {}, tc = {};
    var mp = getModule(key);
    var module, page, config, globalConfig;
    module = mp[0];
    page = mp[1];
    globalConfig = readJson();
    config = readJson(module);
    if (globalConfig) {
        for (i in globalConfig) {
            if ('vars' == i) {
                for (j in globalConfig[i]) {
                    tgc[j] = globalConfig[i][j];
                }
                continue;
            }
            if ('css' == i || 'js' == i) {
                tgc[i] = putOn(globalConfig[i], i);
                continue;
            }
            tgc[i] = globalConfig[i];
        }
    }
    if (config) {
        for (i in config) {
            if ('default' == i) {
                for (j in config[i]) {
                    if ('vars' == j) {
                        for (k in config[i][j]) {
                             tc[k] = config[i][j][k];
                        }
                        continue;
                    }
                    tc[j] = config[i][j];
                }
            }
            if ('page' == i) {
                tc['page'] = {};
                if (config[i][page]) {
                    // this page config
                    for (k in config[i][page]) {
                        if ('head' == k || 'foot'== k) {
                            // head and foot need rewrite
                            if (config[i][page][k]) {
                                tc[k] = config[i][page][k];
                            }
                            continue;
                        }
                        if ('title' == k ) {
                            tc['page'][k] = config[i][page][k] ?
                                                                config[i][page][k] :
                                                                ( tc[k] ? tc[k] : (tgc[k] ? tgc[k]: '') );
                            delete tc[k] && delete tgc[k];
                            continue;
                        }
                        if ('layout' == k) {
                            tc[k] = config[i][page][k] ?
                                config[i][page][k] :
                                ( tc[k] ? tc[k] : (tgc[k] ? tgc[k]: '') );
                            continue;
                        }
                        if ('vars' == k) {
                            for (j in config[i][page][k]) {
                                tc['page'][j] = config[i][page][k][j];
                            }
                            continue;
                        }
                        if ('css' == k || 'js' == k) {
                            //combo css & js
                            if (tc[k] && config[i][page][k]) {
                                tc['page'][k] = putOn(tc[k].concat( config[i][page][k] ), k);
                                delete tc[k];
                                continue;
                            }
                        }
                        // other vars.
                        tc['page'][k] = config[i][page][k];
                    }
                }
            }
        }
    }

    _.merge( tc['page'], inline(module, page) );

    if (tc['css']) {
        tgc['css'] = tgc['css'].concat( tc['css'] );
        delete tc['css'];
    }

    if (tc['js']) {
        tgc['js'] = tgc['js'].concat( tc['js'] );
        delete tc['js'];
    }

    obj = _.extend(tgc, tc);

    if (!obj['layout']) {
        obj['layout'] = 'default';
    }

    if (!obj['head']) {
        obj['head'] = 'theme/default';
    }

    if (!obj['foot']) {
        obj['foot'] = 'theme/default';
    }

    if (obj['page']['__style'].trim() !== '') {
        obj['page']['__style'] = '<style>' + obj['page']['__style'] + '</style>';
    }

    if (obj['page']['__script'].trim() !== '') {
        obj['page']['__script'] = '<script>' + obj['page']['__script'] + '</script>';
    }

    return obj;
}

var UIObject = {
    config: function(path) {
        var key = getKey(path);
        if (key === undefined) return uiConfig;
        var __obj = parseConfig(key);
        uiConfig = _.extend(uiConfig, __obj);
        uiConfig = _.merge(uiConfig, {
            __head: uiConfig.head,
            __screen: '',
            __foot: uiConfig.foot,
            module: getModule(key)[0],
            body: getModule(key)[1],
            layout: uiConfig.layout
        });
        return uiConfig;
    },
    templateEngineListen: function(path, options, func) {
        try {
            var filepath;
            var velocityForString;
            var uiConfig = UIObject.config(path);
            var module = uiConfig.module;
            var body = uiConfig.body;
            var layout = uiConfig.layout;
            var macros = require('./macros');
            var velocity = config.template.engine;
            uiConfig.__head = UIObject.util.getHead(uiConfig.__head, config.template.extension);
            uiConfig.__screen = UIObject.util.getScreen([module, body], config.template.extension);
            uiConfig.__foot = UIObject.util.getFoot(uiConfig.__foot, config.template.extension);
            filepath = UIObject.util.getLayout([cwd, module, layout], config.template.extension);
            try {
                velocityForString = fs.readFileSync(filepath).toString();
                func(null, velocity.render(velocityForString, _.merge({ ui: uiConfig }, options), macros));
            } catch (e) {
            }
        } catch (err) {
            console.log(err);
            func(err);
        }
    },
    util : {
        replaceWith: function(tpl, sub) {
            var i = 0;
            var symbol = '*';
            var str = tpl;
            if (_.isString(sub)) {
                return str.replace(symbol, sub);
            }
            if (_.isArray(sub)) {
                while (i < sub.length) {
                    var p = str.indexOf(symbol);
                    var l = symbol.length;
                    var h = str.substring(0, p);
                    var f = str.substring(p+l);
                    str = h + sub[i] + f;
                    i++;
                }
                return str;
            }
            return '';
        },
        getHead: function(str, ext) {
            var tpl = 'views/ui/*/head.' + ext;
            return this.replaceWith(tpl, str);
        },
        getScreen: function(str, ext) {
            var tpl = 'views/templates/*/screen/*.' + ext;
            return this.replaceWith(tpl, str);
        },
        getFoot: function(str, ext) {
            var tpl = 'views/ui/*/foot.' + ext;
            return this.replaceWith(tpl, str);
        },
        getLayout: function(str, ext) {
            var tpl = '*/views/templates/*/layout/*.' + ext;
            return this.replaceWith(tpl, str);
        }
    }
};

module.exports = UIObject;
