module.exports = function(grunt) {
  // require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-template');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner: '// Puppets v<%= meta.version %>\n'
    },

    preprocess: {
      puppets: {
        src: 'src/build/wrapper.js',
        dest: 'build/puppets.js'
      }
    },

    template: {
      options: {
        data: {
          version: '<%= meta.version %>'
        }
      },
      puppets: {
        src: '<%= preprocess.puppets.dest %>',
        dest: '<%= preprocess.puppets.dest %>'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      puppets: {
        src: '<%= preprocess.puppets.dest %>',
        dest: '<%= preprocess.puppets.dest %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      puppets: {
        src: '<%= preprocess.puppets.dest %>',
        dest: 'build/puppets.min.js',
        options: {
          sourceMap: true
        }
      }
    },

    jshint: {
      puppets: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/*.js', '!src/build/wrapper.js']
      }
    }
  });

  grunt.registerTask('test', 'Test the library', [
    'jshint'
  ]);

  grunt.registerTask('build', 'Build the library', [
    'test',
    'preprocess:puppets',
    'template',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', 'An alias of test', [
    'test'
  ]);
};
