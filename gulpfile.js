/*
CssConcat (gulp-concat-css)
$ npm install --save-dev gulp-concat 

minify-css (gulp-minify-css-mpath)
$ npm install --save-dev gulp-minify-css

Rename(gulp-rename)
$ npm install --save-dev gulp-rename

notify (gulp-notify) - уведомления
$ npm install --save-dev gulp-notify

autoprefixer (gulp-autoprefixer)
$ npm install --save-dev gulp-autoprefixer

sass (gulp-sass)
$ npm install gulp-sass --save-dev

compass (gulp-compass)
$ npm install gulp-compass --save-dev

Sprite (gulp-sprite)
npm install --save-dev gulp-sprite

LiverReload (gulp-connect)
$ npm install --save-dev gulp-connect

Jade (gulp-jade)
$ npm install --save-dev gulp-jade

Merge (merge-stream)
$ npm install --save-dev merge-stream

Concat (gulp-concat)
$ npm install --save-dev gulp-concat

Minify images (gulp-image-optimization)
$ npm install --save-dev gulp-image-optimization
*/

"use strict";

var gulp 			= require('gulp'),
	concatCSS 		= require('gulp-concat-css'),
	sass			= require('gulp-sass'),
    spritesmith     = require('gulp.spritesmith'),
	rename			= require('gulp-rename'),
 	minifyCSS 		= require('gulp-minify-css'),
 	autoprefixer 	= require('gulp-autoprefixer'),
 	notify 			= require('gulp-notify'),
    jade            = require('gulp-jade'),
    concat          = require('gulp-concat'),
    stream          = require('merge-stream'),
    image           = require('gulp-image'),
 	connect 		= require('gulp-connect');
 

//GLOBAL TAST
	gulp.task('global',['watch','connect']);

//watch
gulp.task('watch', function(){
	gulp.watch('./src/sass/**/*.scss',['sass']);
	gulp.watch('./src/jade/**/*.jade',['jade']);
    gulp.watch('./src/js/**/*.js',['js']);
    gulp.watch('./src/images/sprite/*.png',['sprite', 'sass']);
});

//sass
gulp.task('sass', function () {
    var sassStream,
        cssStream;

    sassStream = gulp.src('./src/sass/common.scss')
        .pipe(sass());

    cssStream = gulp.src('./src/css/**/*.css');
    return stream(cssStream, sassStream)
        .pipe(concatCSS('common.css'))
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());
});

//sprite
gulp.task('sprite', function () {
    var spriteData = gulp.src("./src/images/sprite/*.png")
        .pipe(spritesmith({
            imgName:'sprite.png',
            cssName:'_sprite.scss',
            imgPath: '../images/sprite/sprite.png'
        }));
    
    var imgStream = spriteData.img
        .pipe(gulp.dest('./dist/images/sprite'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('./src/sass/base'));

    return stream(imgStream, cssStream);
});

//jade
gulp.task('jade', function() {
    return gulp.src('./src/jade/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});


//js
gulp.task('js', function() {
    var libs = gulp.src('./src/js/libs/*.js')
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./dist/js/libs'));

    var scripts = gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'));

    return stream(libs, scripts)
        .pipe(connect.reload());
});

//server connect
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true
  });
});

//Minify images
gulp.task('images', function() {
    gulp.src(['!./src/images/sprite/**/*.png','./src/images/**/*.png','./src/images/**/*.jpg','./src/images/**/*.gif','./src/images/**/*.jpeg'])
        .pipe(image({
          pngquant: true,
          optipng: false,
          zopflipng: true,
          jpegRecompress: false,
          jpegoptim: true,
          mozjpeg: true,
          gifsicle: true,
          svgo: true,
          concurrent: 10
        })).pipe(gulp.dest('./dist/images/'))
        .pipe(notify('DONE!'));
});


//Remove unused CSS selectors
gulp.task('removeCSS', function () {
    return gulp.src('app/css/template_styles.css')
        .pipe(uncss({
            html: ['app/index.html']
            // html: ['index.html', 'posts/**/*.html', 'http://example.com']
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(notify('DONE!'));
});

