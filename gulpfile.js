const {
    src,
    dest,
    watch,
    parallel,
    series
} = require("gulp");
const scss = require("gulp-sass");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const del = require("del");
const fileinclude = require('gulp-file-include');

function htmlFileInclude() {
    return src("app/components/[^_]*.html")
        .pipe(fileinclude())
        .pipe(dest("app/"))
}

function styles() {
    return src([
        "node_modules/swiper/swiper-bundle.css",
        "node_modules/normalize.css/normalize.css",
        "app/scss/style.scss",
    ])
        .pipe(scss({
            outputStyle: "compressed"
        }))
        .pipe(concat("style.min.css"))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 10 version"],
            grid: true
        }))
        .pipe(dest("app/css"))
        .pipe(browserSync.stream());
}

function scripts() {
    return src([
        "node_modules/swiper/swiper-bundle.js",
        "app/js/main.js"

    ])
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(dest("app/js"))
        .pipe(browserSync.stream());
}

function images() {
    return src("app/img/**/*")
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest("dist/img"))
}

function browser() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return del("dist");
}

function build() {
    return src([
        "app/css/style.min.css",
        "app/fonts/**/*",
        "app/js/*.js",
        "app/*.html",
    ], {
        base: "app"
    })
        .pipe(dest("dist"))
}

function watching() {
    watch("app/scss/**/*.scss", styles);
    watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
    watch("app/*.html").on("change", browserSync.reload);
    watch("app/components/**/*.html").on("change", htmlFileInclude);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browser = browser;
exports.images = images;
exports.cleanDist = cleanDist;
exports.htmlFileInclude = htmlFileInclude;


exports.build = series(cleanDist, images, build);
exports.default = parallel(scripts, styles, htmlFileInclude, browser, watching);