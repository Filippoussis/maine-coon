import gulp from 'gulp';
import sass from 'gulp-sass';
import htmlmin from 'gulp-htmlmin';
import cssmin from 'gulp-csso';
import plumber from 'gulp-plumber';
import svgstore from 'gulp-svgstore';
import browserSync, { watch } from 'browser-sync';
import del from 'del';
import ghPages from 'gulp-gh-pages';

export function html() {
  return gulp.src('./src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build'));
}

export function devStyles() {
  return gulp.src('./src/scss/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(plumber.stop())
    .pipe(gulp.dest('./src', { sourcemaps: '.' }));
}

export function buildStyles() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest('./build'));
}

export function devSprite() {
  return gulp
    .src('src/img/source/sprite/*.svg')
    .pipe(
      svgstore({ inlineSvg: true })
    )
    .pipe(gulp.dest('./src'));
}

export function buildSprite() {
  return gulp
    .src('src/img/source/sprite/*.svg')
    .pipe(
      svgstore({ inlineSvg: true })
    )
    .pipe(gulp.dest('./build'));
}

export function copyFonts() {
  return gulp.src('./src/fonts/**/*.woff2')
    .pipe(gulp.dest('./build/fonts'));
}

export function copyImg() {
  return gulp.src('./src/img/**/*.webp')
    .pipe(gulp.dest('./build/img'));
}

export function clear() {
  return del('build');
}

export function devServer() {
  const bs = browserSync.init({
    server: './src',
    notify: false
  });

  watch('src/*.html').on('change', bs.reload);
  watch('src/scss/**/*.scss', devStyles).on('change', bs.reload);
  watch('src/img/source/sprite/*.svg', devSprite).on('change', bs.reload);
}

export function buildServer() {
  browserSync.init({
    server: './build',
    notify: false
  });
}

// Deploy to Github Pages
// =====================================================================

export function deployGithub() {
  return gulp.src('./build/**/*').pipe(ghPages());
}

const dev = gulp.series(devStyles, devSprite, devServer);
const build = gulp.series(clear, html, copyFonts, copyImg, buildStyles, buildSprite, buildServer);
const deploy = gulp.series(deployGithub);

export {
  dev,
  build,
  deploy
}
