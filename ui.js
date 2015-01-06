// var sys = require('sys');

var rf = require('fs');

var _ = require('lodash');
// default ui config
var ui = {
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
        cssSource = rf.readFileSync(path + page + '.css', 'utf-8');
        embed['__style'] = cssSource;
    } catch(e) {
        embed['__style'] = '';
    }
    try {
        jsSource = rf.readFileSync(path + page + '.js', 'utf-8');
        embed['__script'] = jsSource;
    } catch(e) {
        embed['__script'] = '';
    }
    return embed;
}

function getKey(path) {
    var __key;
    if (path && _.isString(path)) {
        __key = path.replace(/^.*(templates[\\\/])(.+)(\.vm$)/, '$2');
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
        source = rf.readFileSync(path + '/config.json','utf-8');
        return JSON.parse( source );
    } catch(e) {
        return null;
        // throw new Error(e);
    }
}

function parseConfig(key) {
    var module, page, globalConfig, config;
    var i, j, k, arr = [], tgc = {}, tc = {};
    var css, js;
    arr = key.match(/^(.+)[\\\/](.+)$/);
    module = arr[1];
    page = arr[2];
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
                        if ('title' == k) {
                            tc['page'][k] = config[i][page][k] ?
                                                                config[i][page][k] :
                                                                ( tc[k] ? tc[k] : (tgc[k] ? tgc[k]: '') );
                            delete tc[k] && delete tgc[k];
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

    return _.extend(tgc, tc);
}

module.exports = {
    config: function(path) {
        var key = getKey(path);
        if (key === undefined) return ui;
        var __obj = parseConfig(key);
        ui = _.extend(ui, __obj);
        /*
        //debug.
        console.log('-------------ui-------------------');
        for (var ff in ui) {
            if ('page' == ff) {
                console.log('----------------page----------------');
                for (var n in ui[ff]) {
                    console.log('---' + n + ':' + ui[ff][n] + ' \n');
                }
                console.log('----------------end----------------');
                continue;
            }
            console.log('---' + ff + ':' + ui[ff] + ' \n');
        }
        */
        return ui;
    }
};