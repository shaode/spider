/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('home/screen/index.vm', {
        hello: '这是mockdata数据。。。'
    });
};