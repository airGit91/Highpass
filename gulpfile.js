const { src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const del = require('del')
const sync = require('browser-sync').create()


const html = () =>{
    return src('src/**.html')
    .pipe(htmlmin({
        collapseWhitespace: false,
    }))
    .pipe(dest('build/src'))
}

const scss = () =>{
    return src('src/styles/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            grid: true,
            cascade: false,
        }))
        .pipe(csso())
        .pipe(concat('style.css'))
        .pipe(dest('build/src/styles/css'))
}

const scripts = () => {
    return src('src/scripts/**.js')
        .pipe(concat('all.js'))
        .pipe(dest('build/src/scripts'));
}

const clear = () => {
    return del('dist')
}

const serve = () => {
    sync.init({
        server: './dist',
    })
    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/styles/scss/**.scss', series(html)).on('change', sync.reload)
}

exports.html = html
exports.scss = scss
exports.scripts = scripts
// exports.build = series(clear, scss, html)
exports.build = series(html, scss, scripts)
exports.serve = series(clear, scss, html, serve)
exports.clear = clear


/* gulpDev */

const scssDev = () =>{
    return src('src/styles/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            grid: true,
            cascade: false,
        }))
        .pipe(csso())
        .pipe(concat('style.css'))
        .pipe(dest('src/styles/css'))
}

const serveDev = () => {
    sync.init({
        server: './src',
    })
    watch('src/**.html').on('change', sync.reload)
    watch('src/styles/scss/**.scss', series(scssDev)).on('change', sync.reload)
}
exports.scssDev = scssDev

exports.serveDev = series(scssDev, serveDev) //для разработки