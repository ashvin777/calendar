'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');

gulp.task('sass', function () {
  gulp.src('calendar/calendar.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss("calendar/calendar.css"))
    .pipe(gulp.dest('./'))
});

gulp.task('sass:watch', function () {
  gulp.watch('calendar/calendar.scss', ['sass']);
});
