/*
 * use && downlaod
 */
exports.index = function(req, res) {
    res.render('use/screen/index.vm', {
        hello: '这是mockdata数据。。。'
    });
};