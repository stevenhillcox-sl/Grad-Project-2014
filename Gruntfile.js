module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            client: [
                'Gruntfile.js',
                'Client/src/js/**/*.js',
                '!Client/src/js/lib/**/*.js',
                '!Client/src/js/require.js'
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
            build: {
                files: [{
                    expand: true,
                    cwd: 'Client/src/less',
                    src: '**/*.less',
                    dest: 'Client/build/css',
                    ext: '.css'
                }]
            },
            debug: {
                files: [{
                    expand: true,
                    cwd: 'Client/src/less',
                    src: '**/*.less',
                    dest: 'Client/src/css',
                    ext: '.css'
                }]
            }
        },
        requirejs: {
            build: {
                options: {
                    optimize: "uglify",
                    baseUrl: "Client/src/js",
                    name: 'game',
                    mainConfigFile: "Client/src/js/game.js",
                    out: "Client/build/js/game.js"
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    src: ['Client/src/*'],
                    dest: 'Client/build/',
                    filter: 'isFile',
                    flatten: true,
                },{
                    expand: true,
                    src: ['Client/src/js/require.js'],
                    dest: 'Client/build/js/',
                    flatten: true,
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['jshint', 'jasmine']);

    grunt.registerTask('build-client', ['less:build', 'requirejs:build', 'copy:build']);
    grunt.registerTask('build', ['default', 'build-client']);

    grunt.registerTask('debug-client-less', ['less:debug']);

};