/*
 * use && downlaod
 */
exports.index = function(req, res) {
    res.render('use/index', {
        hello: '这是mockdata数据。。。'
    });
};

exports.demo = function(req, res) {
    res.render('use/demo/index', {
        hello: '这是案例演示。。。'
    });
};
