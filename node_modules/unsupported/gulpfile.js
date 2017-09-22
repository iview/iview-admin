var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var rimraf = require('rimraf');
var coveralls = require('gulp-coveralls');

gulp.task('clean', function (cb) {
  rimraf('./coverage', cb);
});

gulp.task('instrument', function () {
  return gulp.src(['src/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['clean', 'instrument'], function () {
  return gulp.src(['test/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});

gulp.task('coveralls', function () {
  gulp.src('coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('default', ['test']);
