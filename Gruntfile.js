
module.exports = function(grunt) {

    // --------------------------------------------------
    // Grunt Packages
    
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect')

    // --------------------------------------------------
    // Grunt main tasks

    grunt.initConfig({

        ngdocs: {
            options: {
                dest: 'dist/docs',
                html5Mode: true,
                // inlinePartials: true,
                scripts: [
                    'node_modules/angular/angular.js',
                    'node_modules/angular-animate/angular-animate.js',
                ]
            },
            all: [
                'src/**/*.js'
            ]
        },

        connect: {
            doc: {
                options: {
                    port: 9000,
                    keepalive: true,
                    base: {
                        path: 'dist/docs',
                        options: {
                            index: 'index.html'
                        }
                    }
                }
            }
        },

    });

    //////////////////////////////////////////////////
    // Grunt tasks

    grunt.registerTask( 'docs', [ 'ngdocs' ] );
    grunt.registerTask( 'serve-docs', [ 'docs', 'connect:doc' ] );
    grunt.registerTask( 'default', [ 'docs' ] );
    
};
