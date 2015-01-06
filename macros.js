var fs = require('fs');
var cwd = process.cwd();

var _ = require('lodash');

module.exports = {
    SLITERAL: function(str) {
        return str;
    },
    cmsparse: function(str) {
        return this.include.apply(this, arguments);
    },
    include: function(str) {
        return this.eval(str);
    },
    parse: function(file) {
        var template = fs.readFileSync(cwd + '/views/templates/' + file).toString();
        return this.eval(template);
    },
    isString: function(str) {
        return _.isString(str);
    }
};