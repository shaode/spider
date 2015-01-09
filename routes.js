/**
 * Module dependencies.
 */
var site = require('./controllers/home'); // default index.js
var mytest = require('./controllers/mytest/');
var singleForm = require('./controllers/mytest/singleForm.js');
var foundation = require('./controllers/mytest/foundation.js');
// more controllers define here.
// ...

module.exports = function(app) {
    // home
    app.get('/', site.index);
    /*
     * mytest module
     */
    // index
    app.get('/mytest/', mytest.index);
    // singleForm
    app.get('/mytest/singleForm', singleForm.form);
    // foundation demo
    app.get('/mytest/foundation', foundation.index);
};