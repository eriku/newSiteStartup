(function() {
  'use strict';

  // -- Utilities
  var gulp    = require('gulp');
  var plumber = require('gulp-plumber');
  var notify  = require('gulp-notify');

  // -- SASS/CSS
  var sass          = require('gulp-sass');
  var sourcemaps    = require('gulp-sourcemaps');
  var cssnano       = require('gulp-cssnano');
  var sassGlob      = require('gulp-sass-glob');
  var autoprefixer  = require('gulp-autoprefixer');
  var sassdoc       = require('sassdoc');

  // -- Paths
  var basePath = 'public_html/';
  var sassPath = basePath + 'scss/{,*/}*.scss';
  var cssPath  = basePath + 'css';

  // --------------------------------------------------------------------------
  //  Settings
  // --------------------------------------------------------------------------

  // sass
  var sassDevOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };

  // SASS | Production
  var sassProdOptions = {
    outputStyle: 'compressed'
  };

  // autoprefixer
  var autoprefixerOptions = {
    browsers: ['last 5 versions']
  };

  // sassDoc
  var sassDocOptions = {
    dest: 'sassdoc',
    exclude: basePath + 'scss/vendors/*',
    autofill: 'content'
  };


  // --------------------------------------------------------------------------
  //  gulp sassdoc
  // --------------------------------------------------------------------------

  gulp.task('sassdoc', function () {
    return gulp
      .src(sassPath)
      .pipe(sassdoc(sassDocOptions))
      .resume();
  });


  // --------------------------------------------------------------------------
  //  gulp styles
  // --------------------------------------------------------------------------
  gulp.task('styles', function() {
    return gulp
      .src(sassPath)
      .pipe(sourcemaps.init())
      .pipe(plumber({
        errorHandler: notify.onError({
          title: 'Gulp',
          message: '<%= error.message %>',
        })
      }))
      .pipe(sassGlob())
      .pipe(sass(sassDevOptions).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(gulp.dest(cssPath))
      .pipe(notify({
           title: 'Gulp',
           message: 'Styles Completed'
       }))
      .resume();
  });


  // --------------------------------------------------------------------------
  //  gulp watch
  // --------------------------------------------------------------------------
  gulp.task('watch', function() {
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
  //  gulp default
  // --------------------------------------------------------------------------
  gulp.task('default', ['styles', 'watch']);


  // --------------------------------------------------------------------------
  //  gulp prod (production)
  // --------------------------------------------------------------------------
  gulp.task('prod', function () {
    return gulp
      .src(sassPath)
      .pipe(sass(sassProdOptions))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(cssnano())
      .pipe(gulp.dest(cssPath));
  });

}());
