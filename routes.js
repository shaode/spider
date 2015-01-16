/**
 * Module dependencies.
 */
var site = require('./controllers/home'); // default index.js
var mytest = require('./controllers/mytest/');
var singleForm = require('./controllers/mytest/singleForm.js');
var use = require('./controllers/use/use.js');
// more controllers define here.
// ...

module.exports = function(app) {
    // home
    app.get('/', site.index);
    // index
    app.get('/mytest/', mytest.index);
    // singleForm
    app.get('/mytest/singleForm', singleForm.form);
    // use & download
    app.get('/use/', use.index);
};