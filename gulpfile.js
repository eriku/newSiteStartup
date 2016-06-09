(function() {
  'use strict';

  // -- Utilities
  var gulp    = require('gulp');
  var notify  = require('gulp-notify');
  var plumber = require('gulp-plumber');

  // -- SASS/CSS
  var autoprefixer  = require('gulp-autoprefixer');
  var bourbon       = require('node-bourbon');
  var sass          = require('gulp-sass');
  var sassGlob      = require('gulp-sass-glob');
  var sourcemaps    = require('gulp-sourcemaps');

  // -- Paths
  var basePath  = 'public_html/views/site/';
  var cssPath   = basePath + 'css';
  var imagePath = basePath + '/images/**/*.{jpg,png}';
  var sassPath  = basePath + 'scss/{,*/}*.scss';

  // --------------------------------------------------------------------------
  //  Settings
  // --------------------------------------------------------------------------

  // sass
  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: bourbon.includePaths
  };

  // autoprefixer
  var autoprefixerOptions = {
    browsers: ['last 5 versions']
  };

  // --------------------------------------------------------------------------
  //  Gulp Task : Styles
  // --------------------------------------------------------------------------
  gulp.task('styles', function() {
    return gulp
      .src(sassPath)
      .pipe(sourcemaps.init())
      .pipe(sassGlob())
      .pipe(plumber({
        errorHandler: notify.onError({
          title: 'Gulp',
          message: '<%= error.message %>',
        })
      }))
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest(cssPath))
      .pipe(notify({
           title: 'Gulp',
           message: 'Styles Completed'
       }))
      .resume();
  });

  // --------------------------------------------------------------------------
  //  Gulp Task : Smushit
  // --------------------------------------------------------------------------
  gulp.task('smushit', function(){
    return gulp
      .src(imagePath)
      .pipe(smushit({
        verbose: true
      }))
      .pipe(gulp.dest(basePath + '/images/'));
  });

  // --------------------------------------------------------------------------
  //  Gulp Task : Watch
  // --------------------------------------------------------------------------
  gulp.task('watch', function() {
    console.log('Use "control + c" to quit');
    return gulp
      // Watch the scss folder for change,
      // and run `styles` task when something happens
      .watch(sassPath, ['styles'])
      // When there is a change,
      // log a message in the console
      .on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      });
  });


  // --------------------------------------------------------------------------
  //  Gulp Task : Default
  // --------------------------------------------------------------------------
  gulp.task('default', ['watch']);

}());
