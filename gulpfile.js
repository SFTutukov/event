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

LiverReload (gulp-connect)
$ npm install --save-dev gulp-connect

Jade (gulp-jade)
npm install --save-dev gulp-jade
*/

"use strict";

var gulp 			= require('gulp'),
	// concatCSS 		= require('gulp-concat-css'),
	sass			= require('gulp-sass'),
	rename			= require('gulp-rename'),
 	minifyCSS 		= require('gulp-minify-css'),
 	autoprefixer 	= require('gulp-autoprefixer'),
 	notify 			= require('gulp-notify'),
    jade            = require('gulp-jade');
 	// connect 		= require('gulp-connect');
 

//GLOBAL TAST
	gulp.task('global',['connect','html','less','watch']);

//watch
gulp.task('watch', function(){
	gulp.watch('./src/sass/**/*.scss',['sass']);
	gulp.watch('./src/jade/**/*.jade',['jade']);
	// gulp.watch('index.html',['html']);
});


//sass
gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(minifyCSS())
        .pipe(rename("common.css"))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify('DONE!'));
});

//jade
gulp.task('jade', function() {
    return gulp.src('./src/jade/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./dist/'))
});

// gulp.task('less', function () {
//   return gulp.src('./src/sass/*.scss')
//     .pipe(less())
//     .pipe(csso())
//     .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
//     .pipe(minifyCSS())
//     .pipe(rename("template_styles.css"))
//     .pipe(gulp.dest('app/css'))
//     .pipe(connect.reload())
//     .pipe(notify('DONE!'));
// });

//html
gulp.task('html', function () {
	return gulp.src("index.html")
	.pipe(gulp.dest('app'))
	.pipe(connect.reload())
	.pipe(notify('DONE!'));
});

//server connect
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

//Minify images
// gulp.task('images', function(cb) {
//     gulp.src(['images/**/*.png','images/**/*.jpg','images/**/*.gif','images/**/*.jpeg']).pipe(imageop({
//         optimizationLevel: 5,
//         progressive: true,
//         interlaced: true
//     })).pipe(gulp.dest('app/images-min/')).on('end', cb).on('error', cb)
//     .pipe(notify('DONE!'));
// });


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

