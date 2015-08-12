module.exports = function ( grunt ) {
    "use strict";
    grunt.initConfig( {
        browserify: {
            vendor: {
                src: [],
                dest: 'public/vendor.js'
            },
            client: {
                src: ['lib/adapter.js'],
                dest: 'public/app.js'
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    grunt.registerTask( 'default', ['jshint'] );

    grunt.loadNpmTasks( 'grunt-browserify' );

};