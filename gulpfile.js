const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const webp = require('gulp-webp');
const sync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const del = require('del');
const browserSync = require('browser-sync');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

const clean = () => {
    return del(['dev/*'])
}

const htmlInclude = () => {
    return src(['./index.html'])
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file',
        }))
        .pipe(dest('./dev'))
        .pipe(browserSync.stream())
}

const styles = () => {
    return src('./src/styles/scss/**.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', notify.onError()))
        .pipe(concat('style.css'))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(autoprefixer({
            grid: true,
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dev/src/styles/css'))
        .pipe(browserSync.stream())
}

const imgToDev = () => {
    return src(['./src/images/**/**.jpg'])
        .pipe(dest('./dev/src/images'))
}

const svgToDev = () => {
    return src(['./src/images/**.svg'])
        .pipe(dest('./dev/src/images'))
}

const fontsToDev = () => {
    return src(['./src/fonts/**'])
        .pipe(dest('./dev/src/fonts'))
}

const scripts = () => {
    return src('./src/scripts/index.js')
        // .pipe(webpackStream({
        //     output: {
        //         filename: 'index.js',
        //     },
        //     module: {
        //         rules: [{
        //             test: /\.m?js$/,
        //             exclude: /node_modules/,
        //             use: {
        //                 loader: 'babel-loader',
        //                 options: {
        //                     presets: [
        //                         ['@babel/preset-env', {
        //                             targets: "defaults"
        //                         }]
        //                     ]
        //                 }
        //             }
        //         }]
        //     }
        // }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            toplevel: true,
        }).on('error', notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dev/src/scripts/'))
        .pipe(browserSync.stream())
}

const watchFiles = () => {
    sync.init({
        server: './dev',
    })
    watch('./index.html', htmlInclude);
    watch('./src/styles/scss/**.scss', styles);
    watch('./src/images/**/**.jpg', imgToDev);
    watch('./src/images/**.svg', svgToDev);
    watch('./src/images/**.svg', fontsToDev);
    watch('./src/scripts/**/**.js', scripts);
}

exports.fileInclude = htmlInclude;
exports.styles = styles;
exports.watchFiles = watchFiles;


exports.default = series(clean, parallel(htmlInclude, scripts, imgToDev, svgToDev, fontsToDev), styles, watchFiles);

//BUILD//

const cleanBuild = () => {
    return del(['build/*'])
}

const htmlBuild = () => {
    return src(['./index.html'])
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file',
        }))
        .pipe(dest('./build'))
        .pipe(browserSync.stream())
}

const htmlMin = () => {
    return src('./**.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
        }))
        .pipe(dest('build'))
}

const stylesBuild = () => {
    return src('./src/styles/scss/**.scss')
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', notify.onError()))
        .pipe(concat('style.css'))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(autoprefixer({
            grid: true,
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('./build/src/styles/css'))
}

const scriptsBuild = () => {
    return src('./src/scripts/index.js')
        // .pipe(webpackStream({
        //     output: {
        //         filename: 'index.js',
        //     },
        //     module: {
        //         rules: [{
        //             test: /\.m?js$/,
        //             exclude: /node_modules/,
        //             use: {
        //                 loader: 'babel-loader',
        //                 options: {
        //                     presets: [
        //                         ['@babel/preset-env', {
        //                             targets: "defaults"
        //                         }]
        //                     ]
        //                 }
        //             }
        //         }]
        //     }
        // }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            toplevel: true,
        }).on('error', notify.onError()))
        .pipe(dest('./build/src/scripts/'))
}

const imgToBuild = () => {
    return src(['./src/images/**/**.jpg'])
        .pipe(dest('./build/src/images'))
}

const svgToBuild = () => {
    return src(['./src/images/**.svg'])
        .pipe(dest('./build/src/images'))
}

const fontsToBuild = () => {
    return src(['./src/fonts/**'])
        .pipe(dest('./build/src/fonts'))
}

exports.build = series(cleanBuild, parallel(htmlBuild, scriptsBuild, imgToBuild, svgToBuild, fontsToBuild), htmlMin, stylesBuild);