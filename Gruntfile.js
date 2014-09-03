module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            self: ['Gruntfile.js'],
            client: [
                'Client/src/js/**/*.js',
                '!Client/src/js/lib/**/*.js',
                '!Client/src/js/require.js'
            ],
            server: [
                'Server/**/*.js'
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
            client: {
                options: {
                    specs: 'Client/src/js/spec/**/*.js',
                    template: require('grunt-template-jasmine-requirejs')
                }
            }
        },
        jasmine_node: {
            server: ['Server/spec/']
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
                }, {
                    expand: true,
                    src: ['Client/src/js/require.js'],
                    dest: 'Client/build/js/',
                    flatten: true,
                }]
            }
        },
        clean: {
            server: ["Server/data"]
        },
        mkdir: {
            server: {
                options: {
                    create: ['Server/data/db']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-mkdir');

    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('build-client', ['jshint:client', 'jasmine:client', 'less:build', 'requirejs:build', 'copy:build']);
    grunt.registerTask('build-server', ['jshint:server', 'jasmine_node:server', 'clean:server', 'mkdir:server']);
    grunt.registerTask('build', ['build-client', 'build-server']);

    grunt.registerTask('debug-client-less', ['less:debug']);

};