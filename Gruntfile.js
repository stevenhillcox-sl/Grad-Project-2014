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
                    template: require('grunt-template-jasmine-requirejs'),
                    keepRunner: true
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
                    name: 'index',
                    mainConfigFile: "Client/src/js/index.js",
                    out: "Client/build/js/index.js"
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
                    src: ['Client/src/img/*'],
                    dest: 'Client/build/img/',
                    flatten: true,
                }, {
                    expand: true,
                    src: ['Client/src/js/require.js'],
                    dest: 'Client/build/js/',
                    flatten: true,
                }]
            }
        },
        execute: {
            serverBuild: {
                src: ['Server/main.js'],
                options: {
                    args: ['Client/build']
                }
            },
            serverDebug: {
                src: ['Server/main.js'],
                options: {
                    args: ['Client/src']
                }
            }
        },
        autoprefixer: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'Client/build/css',
                    src: '**/*.css',
                    dest: 'Client/build/css',
                    ext: '.css'
                }]
            },
            debug: {
                files: [{
                    expand: true,
                    cwd: 'Client/src/css',
                    src: '**/*.css',
                    dest: 'Client/src/css',
                    ext: '.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('build-client', ['jshint:client', 'jasmine:client', 'less:build', 'autoprefixer:build', 'requirejs:build', 'copy:build']);
    grunt.registerTask('build-server', ['jshint:server', 'jasmine_node:server']);
    grunt.registerTask('build', ['build-client', 'build-server']);

    grunt.registerTask('deploy', ['build', 'execute:serverBuild']);

    grunt.registerTask('debug-client-css', ['less:debug', 'autoprefixer:debug']);
    grunt.registerTask('debug-deploy', ['debug-client-css', 'execute:serverDebug']);
};