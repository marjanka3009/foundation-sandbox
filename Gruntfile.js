module.exports = function(grunt) {
  var hljs = require('highlight.js');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    assemble: {
      options: {
        flatten: false,
        assets: 'dist/assets/',
        data: ['src/data/*.json'],
        marked: {
          gfm: true,
          sanitize: false,
          highlight: function(code, lang) {
            if (lang === undefined) lang = 'bash';
            if (lang === 'html') lang = 'xml';
            if (lang === 'js') lang = 'javascript';
            return '<div class="code-container">' + hljs.highlight(lang, code).value + '</div>';
          }
        }
      },
      dist: {
        options: {
          partials: ['src/partials/*.html'],
          helpers: ['src/helpers/*.js'],
          layout: 'src/layouts/default.html'
        },
        expand: true,
        cwd: 'src/pages/',
        src: '**/*.html',
        dest: 'dist/'
      }
    },

    compass: {
      options: {
        importPath: ['bower_components/foundation/scss']
      },                  
      dist: {                   
        options: {              
          sassDir: ['src/assets/scss/'],
          cssDir: ['dist/assets/css/'],
          environment: 'development',
          outputStyle: 'expanded'
        }
      }
    },

    copy: {
      dist: {
        files: [
          {expand:true, cwd: 'src/assets/', src: ['**/*','!{scss,js}/**/*'], dest: 'dist/assets/', filter:'isFile'},
          {expand:true, cwd: 'bower_components/modernizr/', src: 'modernizr.js', dest: 'dist/assets/js', filter:'isFile'}
        ]
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/assets/js/all.js': ['bower_components/jquery/dist/jquery.js', 'bower_components/foundation/js/foundation.js', 'src/assets/js/*']
        }
      }
    },

    clean: ['dist/'],

    watch: {
      grunt: { 
        files: ['Gruntfile.js'],
        tasks: ['build'] 
      },

      compass: {
        files: ['src/assets/scss/**/*.scss'],
        tasks: ['compass']
      },

      copy: {
        options: {cwd: 'src/assets/'},
        files: ['**/*','!{scss,js}/**/*'],
        tasks: ['copy']
      },

      uglify: {
        options: {cwd: 'src/assets/js'},
        files: ['**/*.js'],
        tasks: ['uglify']
      },

      assemble_all: {
        files: ['src/{partials,layouts}/**/*.html'],
        tasks: ['assemble'],
        options: {livereload:true}
      },

      assemble_pages: {
        files: ['src/pages/**/*.html'],
        tasks: ['newer:assemble'],
        options: {livereload:true}
      }
    }
  });

  // grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('build', ['clean','compass','uglify','assemble','copy']);
  grunt.registerTask('default', ['build','watch']);
}