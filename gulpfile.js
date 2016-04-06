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
  var sassdoc       = require('sassdoc');
  var sassGlob      = require('gulp-sass-glob');
  var sourcemaps    = require('gulp-sourcemaps');

  // -- Paths
  var basePath = 'public_html/';
  var cssPath  = basePath + 'css';
  var sassPath = basePath + 'scss/{,*/}*.scss';

  // --------------------------------------------------------------------------
  //  Settings
  // --------------------------------------------------------------------------

  // sass
  var sassDevOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: bourbon.includePaths
  };

  // SASS | Production
  var sassProdOptions = {
    outputStyle: 'compressed',
    includePaths: bourbon.includePaths
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
  gulp.task('default', ['watch']);


  // --------------------------------------------------------------------------
  //  gulp prod (production)
  // --------------------------------------------------------------------------
  gulp.task('prod', function () {
    return gulp
      .src(sassPath)
      .pipe(sass(sassProdOptions))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(gulp.dest(cssPath));
  });

}());
