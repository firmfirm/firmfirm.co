var gulp = require('gulp');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

gulp.task('watch:scripts', ['scripts'], browserSync.reload);
gulp.task('watch:styles', ['styles'], browserSync.reload);
gulp.task('watch:html', ['html'], browserSync.reload);
gulp.task('watch:images', ['images'], browserSync.reload);

gulp.task('default', ['build'], function() {

  // Serve files from the root of this project
    browserSync({
        notify: false,
        server: {
            baseDir: ".dist"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("src/scripts/*", ['watch:scripts']);
    gulp.watch("src/styles/*", ['watch:styles']);
    gulp.watch("src/images/*", ['watch:images']);
    gulp.watch("src/**/*.html", ['watch:html']);

});

gulp.task('dist:serve', ['dist:build'], function() {
  browserSync({
      notify: false,
      server: {
          baseDir: ".dist"
      }
  });
});

gulp.task('clean', function() {
  return gulp.src('.dist', { read: false })
             .pipe($.clean());
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
             .pipe(gulp.dest('.dist/images'));
});

gulp.task('dist:images', function() {
  return gulp.src('src/images/**/*')
             .pipe($.imagemin({
               progressive: true
             }))
             .pipe(gulp.dest('.dist/images'));
});

gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
             .pipe($.sass().on('error', $.sass.logError))
             .pipe(gulp.dest('.dist/styles'));
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
             .pipe(gulp.dest('.dist/scripts'));
});

gulp.task('vendor', function() {
  var files = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/sticky-kit/jquery.sticky-kit.min.js'
  ];
  return gulp.src(files)
             .pipe(gulp.dest('.dist/vendor'));
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
             .pipe(gulp.dest('.dist'));
});

gulp.task('dist:html', function() {
  return gulp.src('src/**/*.html')
             .pipe($.smoosher({ base: '.dist' }))
             .pipe($.htmlmin({
               removeComments: true,
               removeCommentsFromCDATA: true,
               removeCDATASectionsFromCDATA: true,
               collapseWhitespace: true,
               collapseBooleanAttributes: true,
               removeAttributeQuotes: true,
               removeRedundantAttributes: true,
               preventAttributesEscaping: true,
               useShortDoctype: true,
               removeEmptyAttributes: true,
               removeScriptTypeAttributes: true,
               removeStyleLinkTypeAttributes: true,
               removeOptionalTags: true,
               removeIgnored: true,
               minifyJS: true,
               minifyCSS: true,
               minifyURLs: true,
               processScripts: true
             }))
             .pipe(gulp.dest('.dist'));
});

gulp.task('deploy', ['dist:build'], function() {
  return gulp.src('.dist/**/*')
             .pipe($.ghPages());
});

gulp.task('dist:assets:clean', function() {
  return gulp.src(['.dist/scripts', '.dist/styles'], { read: false })
             .pipe($.clean());
});

gulp.task('dist:copy', function() {
  return gulp.src(['src/CNAME', 'src/robots.txt'])
             .pipe(gulp.dest('.dist'));
});

gulp.task('build', function(cb) {
  return runSequence(
    'clean',
    ['images', 'styles', 'scripts', 'vendor'],
    'html',
    cb
  );
});

gulp.task('dist:build', function(cb) {
  return runSequence(
    'clean',
    ['dist:images', 'styles', 'scripts', 'vendor', 'dist:copy'],
    'dist:html',
    'dist:assets:clean',
    cb
  );
})
