module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            // define the files to lint
            files: ['gruntfile.js', 'src/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                  // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        shell: {
            deployShell : {
                command: './Deploy.sh'
            },
            pullShell: {
                command: 'git pull'
            }
        },
        jasmine_node: {
            all: ['src/spec/']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.registerTask('deploy', ['default', 'shell:deployShell']);
    grunt.registerTask('pullDeploy', [ 'shell:pullShell' , 'deploy']);
    grunt.registerTask('default', ['jshint', 'jasmine_node']);
};