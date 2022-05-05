const {
    src,
    dest,
    series,
    watch
} = require('gulp')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const htmlmin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify-es').default
const sourcemaps = require('gulp-sourcemaps')
const svgSprite = require('gulp-svg-sprite')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const del = require('del')
const sync = require('browser-sync').create()


const html = () => {
    return src('src/**.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
        }))
        .pipe(dest('build/src'))
}

const scss = () => {
    return src('src/styles/scss/**.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            grid: true,
            cascade: false,
        }))
        .pipe(csso())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(dest('build/src/styles/css'))
}

const scripts = () => {
    return src('src/scripts/**.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest('build/src/scripts'));
}

const svgSprites = () => {
    return src('src/images/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('build/src/images'))
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
exports.build = series(html, scss, scripts, svgSprites)
// exports.serve = series(clear, scss, html, serve)
exports.clear = clear


/* gulp Dev */

const scssDev = () => {
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

const dev = () => {
    sync.init({
        server: './src',
    })
    watch('src/**.html').on('change', sync.reload)
    watch('src/styles/scss/**.scss', series(scssDev)).on('change', sync.reload)
}

exports.scssDev = scssDev
exports.dev = series(scssDev, dev) //для разработки