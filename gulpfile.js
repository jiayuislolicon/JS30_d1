var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    plugins = require('gulp-load-plugins')(),
    babel = require('gulp-babel'),
    webserver = require('gulp-webserver'),
    pug = require('gulp-pug');

// Styles
gulp.task('styles', function() {
  gulp.src('./src/style/**/*.scss')    // 指定要處理的 Scss 檔案目錄
    .pipe(sass()) // 編譯 Scss
    .pipe(gulp.dest('./src/style')) // 指定編譯後的 css 檔案目錄
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
  gulp.src('./src/js/**/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(babel({ presets: ['env'] }))
    .pipe(gulp.dest('./src/js'))
    .pipe(notify({ message: 'Scripts task complete' }))
    .pipe(livereload());
});

// Images
gulp.task('images', function() {
  gulp.src('./src/asset/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./src/image'))
    .pipe(notify({ message: 'Images task complete' }))
    .pipe(livereload());
});

//pug
gulp.task('pug', function () {
  gulp.src('./src/*.pug')
    .pipe(plugins.plumber())
    .pipe(plugins.pug({
      pretty: true // 默认为false，表示是否美化HTML
    }))
    .pipe(gulp.dest('./src'))
    .pipe(livereload());
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/scripts', 'dist/images']);
});

gulp.task('webserver', function() {
  gulp.src('./src/')
    .pipe(webserver({
      port:1234,
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: 'index.html'
    }));
});

// Default task
gulp.task('default', ['webserver'], function() {
  gulp.start('styles', 'scripts', 'images', 'pug', 'watch');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/style/**/*.scss', ['styles']);

  //Watch .pug files
  gulp.watch('src/*.pug', ['pug']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/asset/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['src/*']).on('change', livereload.changed);

});