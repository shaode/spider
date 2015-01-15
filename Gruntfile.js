'use strict';

module.exports = function(grunt) {

	var transport = require('grunt-cmd-transport');

	var style = transport.style.init(grunt);

	var text = transport.style.init(grunt);

	var script = transport.script.init(grunt);

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg : grunt.file.readJSON('package.json'),
		banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		copy : {
			/*
			 * assets 为静态文件的目录，存放编译打包后的js&css
			 */
			sea: {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['sea.js', 'seajs-style/**'],
					dest : 'assets'
				}]
			},
			$ : { // jQuery 默认请求sea-modules下的 $
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['$.js', '$-2.1.1.js'],
					dest : 'assets'
				}]
			},
			// 自定义插件，放在公共目录下面
			select : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['select/1.0.0/*'],
					dest : 'assets'
				}]
			},
			cellula : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['cellula/0.4.2/*.js'],
					dest : 'assets'
				}]
			},
			fdp : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['fdp/**/*.js'],
					dest : 'assets'
				}]
			},
            // test.
            globalcss: {
				files : [{
					expand : true,
					cwd : 'static/css/',
					src : ['global/**/*.css'],
					dest : 'assets'
				}]
			},
            commonjs: {
				files : [{
					expand : true,
					cwd : 'static/js/',
					src : ['common/**/*.js'],
					dest : 'assets'
				}]
			}
		},
		transport : {
			options : {
				debug : false,
				alias : '<%= pkg.alias %>',
				parsers : {
					'.js' : [script.jsParser],
					'.css' : [style.css2jsParser]
				},
				paths : ['assets']
			},
			select : {
				options : {
					idleading : 'select/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/select/1.0.0',
					src : '*.js',
					dest : 'assets/select/1.0.0'
				}]
			},
			cellula : {
				options : {
					idleading : 'cellula/0.4.2/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/cellula/0.4.2',
					src : '*.js',
					dest : 'assets/cellula/0.4.2'
				}]
			},
			fdp_1_0_0 : {
				options : {
					idleading : 'fdp/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/fdp/1.0.0',
					src : '*.js',
					dest : 'assets/fdp/1.0.0'
				}]
			},
			fdp_1_1_0: {
				options : {
					idleading : 'fdp/1.1.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/fdp/1.1.0',
					src : '*.js',
					dest : 'assets/fdp/1.1.0'
				}]
			},
            /*
             * 业务层
             */
			mytest: {
				options : {
					idleading : 'mytest/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/mytest/1.0.0',
					src : '*.js',
					dest : 'assets/mytest/1.0.0'
				}]
			}
		},
		cssmin: {
            options: {
                //keepSpecialComments: 0
            },
            minify: {
                expand: true,
                cwd: 'assets/',
                src: ['select/**/*.css', 'global/**/*.css', 'home/**/*.css'],
                dest: 'assets/',
                ext: '.css'
            },
	        compress: {
	             files: {
                     'assets/foundation/5.5.0/foundation.css': ['lib/foundation/5.5.0/css/normalize.css', 'lib/foundation/5.5.0/css/foundation.css']
	             }
	        }
     	},
        css_import: {
            compress: {
                files: {
                    'assets/global/1.0.0/index.css': ['static/css/global/1.0.0/index.css'],
                    'assets/home/1.0.0/index.css': ['static/css/home/1.0.0/index.css'],
                    'assets/mytest/1.0.0/mytest.css': ['static/css/mytest/1.0.0/all_modules.css']
                }
            }
        },
		concat : {
			cellula: {
                options : {
                    paths : ['.'],
                    separator: ';'
                },
				files : {
					'assets/cellula/0.4.2/cellula.js': ['assets/cellula/0.4.2/*.js']
				}
			},
			fdp : {
                options : {
                    paths : ['.'],
                    separator: ';'
                },
				files : {
					'assets/fdp/1.0.0/fdp.js': ['assets/fdp/1.0.0/*.js'],
					'assets/fdp/1.1.0/fdp.js': ['assets/fdp/1.1.0/*.js']
				}
			},
            foundation : {
                options : {
                    noncmd: true
                },
                files: {
                    'assets/foundation/5.5.0/foundation.js': ['lib/foundation/5.5.0/js/vendor/*.js', 'lib/foundation/5.5.0/js/foundation.js', 'lib/foundation/5.5.0/js/foundation/*.js']
                }
            }
		},
        uglify : {
            options: {
                mangle: true
            },
            compress: {
                files : [{
                    expand : true,
                    cwd : 'assets/',
                    src : ['$.js', 'select/**/*.js', 'cellula/**/*.js', 'fdp/**/*.js', 'foundation/5.5.0/foundation.js', 'common/**/*.js', 'mytest/**/*.js'],
                    dest : 'assets/'
                }]
            }
        },
        jshint: {
            ignore_warning: {
                options: {
                    "curly"         : false,     // true: Require {} for every new block or scope
                    "eqeqeq"        : false,     // true: Require triple equals (===) for comparison
                    "immed"         : false,    // true: Require immediate invocations to be wrapped in parens e.g. `(function () { } ());`
                    "latedef"       : false,    // true: Require variables/functions to be defined before being used
                    "newcap"        : false,    // true: Require capitalization of all constructor functions e.g. `new F()`
                    "noarg"         : false,     // true: Prohibit use of `arguments.caller` and `arguments.callee`
                    "sub"           : false,     // true: Prohibit use of empty blocks
                    "undef"         : false,     // true: Require all non-global variables to be declared (prevents global leaks)
                    "boss"          : false,     // true: Require all defined variables be used
                    "eqnull"        : false,     // true: Requires all functions run in ES5 Strict Mode
                    "es3"           : false,    // {int} Max number of formal params allowed per function
                    "-W015"         : false
                },
                src: ['static/js/**/**/*.js']
            }
        },
		clean : {
			temp : []
		},
        watch: {
            style: {
                files: ['static/css/**/*.css'],
                tasks: ['cssmin', 'css_import']
            },
            scripts: {
                files: ['lib/**/**/*.js', 'static/js/**/**/*.js'],
                tasks: ['transport', 'concat', 'uglify']
            }
        }
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css-import');
	//grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Default task.
	grunt.registerTask('default', ['copy', 'transport', 'concat',  'css_import', 'cssmin',  'uglify', 'clean', 'jshint' ]);

};
