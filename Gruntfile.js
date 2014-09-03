module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'Gruntfile.js',
                'Client/src/js/**/*.js',
                '!Client/src/js/lib/**/*.js',

            ],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        jasmine: {
            clientUnitTest: {
                options: {
                    specs: 'Client/src/js/spec/**/*.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    keepRunner: true
                }
            }
        },
        less: {
            files: {
                expand: true,
                cwd: 'Client/src/less',
                src: '**/*.less',
                dest: 'Client/css',
                ext: '.css'
            }
        },
        requirejs: {
            compile: {
                options: {
                    optimize: "uglify",
                    baseUrl: "Client/src/js",
                    name: 'game',
                    mainConfigFile: "Client/src/js/game.js",
                    out: "Client/js/game-min.js"
                }
            },
            debug: {
                options: {
                    optimize: 'none',
                    baseUrl: "Client/src/js",
                    name: 'game',
                    mainConfigFile: "Client/src/js/game.js",
                    out: "Client/js/game-min.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['jshint', 'jasmine']);
    grunt.registerTask('build-client', ['less', 'requirejs:compile'])
    grunt.registerTask('build', ['default', 'build-client'])

    grunt.registerTask('build-client-debug', ['less', 'requirejs:debug'])

};