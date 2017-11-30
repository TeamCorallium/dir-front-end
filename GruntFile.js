2
module.exports = function(grunt) {
    var gtx = require('gruntfile-gtx').wrap(grunt);

    gtx.loadAuto();

    var gruntConfig = require('./grunt');
    gruntConfig.package = require('./package.json');

    gtx.config(gruntConfig);

    // // We need our bower components in order to develop
    gtx.alias('build:frontend', ['compass:frontend', 'clean:frontend', 'copy:frontend', 'concat:frontend', 'cssmin:frontend', 'uglify:frontend']);




    gtx.finalise();

    // Grunt T-Shirts
    /* grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration will be written here
        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: './libs',
                    cleanTargetDir: true
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/app.js': ['dist/app.js']
                },
                options: {
                    mangle: false
                }
            }
        },

        html2js: {
            dist: {
                src: ['HTML/*.html', 'HTML/views/*.html'],
                dest: 'tmp/templates.js'
            }
        },

        clean: {
            temp: {
                src: ['tmp']
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['HTML/assets/*.js', 'HTML/assets/js/*.js', 'tmp/*.js'],
                dest: 'dist/app.js'
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'HTML/assets/*.js', 'HTML/assets/js/*.js', ]
        },

        connect: {
            server: {
                options: {
                    hostname: 'www.dir.com',
                    port: 8080
                }
            }
        },

        watch: {
            dev: {
                files: ['Gruntfile.js', 'HTML/assets/*.js', 'HTML/assets/js/*.js', 'HTML/assets/*.html', 'HTML/assets/views/*.html'],
                tasks: ['jshint', 'html2js:dist', 'concat:dist', 'clean:temp'],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: ['Gruntfile.js', 'HTML/assets/*.js', 'HTML/assets/js/*.js', 'HTML/assets/*.html', 'HTML/assets/views/*.html'],
                tasks: ['jshint', 'html2js:dist', 'concat:dist', 'clean:temp', 'uglify:dist'],
                options: {
                    atBegin: true
                }
            }
        },

        compress: {
            dist: {
                options: {
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [{
                    src: ['HTML/index.html'],
                    dest: '/'
                }, {
                    src: ['dist/**'],
                    dest: 'dist/'
                }, {
                    src: ['HTML/assets/**'],
                    dest: 'assets/'
                }, {
                    src: ['libs/**'],
                    dest: 'libs/'
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('dev', ['bower', 'connect:server', 'watch:dev']);
    grunt.registerTask('test', ['bower', 'jshint']);
    grunt.registerTask('minified', ['bower', 'connect:server', 'watch:min']);
    grunt.registerTask('package', ['bower', 'jshint', 'html2js:dist', 'concat:dist', 'uglify:dist',
        'clean:temp', 'compress:dist'
    ]); */

};