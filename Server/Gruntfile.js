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
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('deploy', ['jshint', 'shell:deployShell']);
    grunt.registerTask('pullDeploy', [ 'shell:pullShell' , 'deploy']);
};