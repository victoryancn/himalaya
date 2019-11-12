const del = require('del')
const gulp = require('gulp')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')

gulp.task('default', ['build'])

gulp.task('build', ['cleanLib', 'buildSrc', 'buildDist'])

gulp.task('cleanLib', () => {
  return del(['lib'], { force: true })
})

gulp.task('cleanDist', () => {
  return del(['dist'], { force: true })
})

gulp.task('buildSrc', ['cleanLib'], () => {
  return gulp
    .src(['src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('lib'))
})

gulp.task('buildDist', ['cleanDist'], () => {
  const options = {
    entries: ['index.js'],
    debug: false,
    basedir: 'src',
    standalone: 'himalaya'
  }
  return browserify(options)
    .transform(babelify)
    .bundle()
    .pipe(source('himalaya.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      // loads map from browserify file
      loadMaps: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('docs/dist'))
})
