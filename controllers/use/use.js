/*
 * use && downlaod
 */
exports.index = function(req, res) {
    res.render('use/screen/index.vm', {
        hello: '这是mockdata数据。。。'
    });
};

exports.demo = function(req, res) {
    res.render('use/screen/demo/index.vm', {
        hello: '这是案例演示。。。'
    });
};