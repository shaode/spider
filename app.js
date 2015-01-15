/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var http = require('http');
var express = require('express');
var config = require('./config');
var routes = require('./routes');
var _ = require('lodash');
var ui = require('./ui');
var cwd = process.cwd();
// application
var app = express();
// all environments
app.use(express.favicon());
//app.use(express.logger());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
// custom middleware
app.set('views', path.join(__dirname, 'views/templates'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// template engine
app.engine( config.template.extension, config.template.callback(ui.templateEngineListen) );
// set port
app.set('port', process.env.PORT || 3000);
var port = process.argv[2];
port = /^\d{4,5}$/.test(port) ? port : app.get('port');
// console.log('Listening on', port);

// controllers
routes(app);

http.createServer(app).listen(port, function() {
    console.log('Server listening on port ' + port);
})
    .on('error', function(err) {
    console.log('Error',err.code);
});
