var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var sass = require("gulp-ruby-sass");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");

gulp.task('html', function() {
    return gulp.src(["src/*.html"])
        .pipe(gulp.dest("build"));
});

gulp.task('scripts', function() {
    return gulp.src("src/js/*.js")
        .pipe(concat("main.js"))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest("build/js"));
});

gulp.task('sass', function() {
    return sass("src/scss/style.scss", {style: "compressed"})
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("build/css"));
});

gulp.task('images', function() {
    return gulp.src("src/img/**/*")
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest("build/img"));
});

gulp.task("watch", function() {
    gulp.watch("src/*.html", ["html"]);
    gulp.watch("src/js/*.js", ["scripts"]);
    gulp.watch("src/scss/*.scss", ["sass"]);
    gulp.watch("src/img/**/*", ["images"]);
});

gulp.task("default", ["html", "scripts", "sass", "images", "watch"]);