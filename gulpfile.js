var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', function () { // Создаем таск "sass"
  return gulp
      .src('assets/style/scss/**/*.scss') // Берем источник
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write({includeContent: false}))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 8', 'IE 10', 'IE 11'],
        cascade: false
      }))
      .pipe(sourcemaps.write('../css/maps'))
      .pipe(gulp.dest('assets/style/css')) // Выгружаем результата в папку app/css
});

gulp.task('default', [ 'scss'], function () {
  gulp.watch('assets/style/scss/**/*.scss', ['scss']); // Наблюдение за sass файлами
});