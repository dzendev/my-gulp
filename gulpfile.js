const del             = require('del');
const gulp            = require('gulp');
const pipeIf          = require('gulp-if');
const pug             = require('gulp-pug');
const plumberNotifier = require('gulp-plumber-notifier');
const htmlReplace     = require('gulp-html-replace');
const imagemin        = require('gulp-imagemin');
const newer           = require('gulp-newer');
const browserSync     = require('browser-sync');
const env             = process.env.NODE_ENV;

function clear() {
	return del(['build/*']);
}

function moveFont() {
	return gulp.src('dev/lib/fonts/*')
		.pipe(newer('build/fonts'))
		.pipe(gulp.dest('build/fonts'));
}

function moveJS() {
	return gulp.src([
			'dev/lib/js/*.js',
			// './node_modules/babel-polyfill/dist/polyfill.min.js'
		])
		.pipe(newer('build/js'))
		.pipe(gulp.dest('build/js'));
}

function sync() {
	return browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false
	});
}

function html() {
	return gulp.src(['dev/pug/**/*.pug', '!dev/pug/layout.pug'])
		.pipe(plumberNotifier())
		.pipe(pug({ pretty: true }))
		.pipe(pipeIf(env === 'production', htmlReplace({
			css: 'css/style.min.css',
			js_app: 'js/app.min.js',
			js_script: 'js/script.min.js'
		})))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
}

function img() {
	return gulp.src([
		'dev/img/**/*.*',
		'!dev/img/sprite-svg/*.*',
		'!dev/img/sprite-png/*.*'
	])
	.pipe(newer('build/img'))
	.pipe(pipeIf(env === 'production', imagemin()))
	.pipe(gulp.dest('build/img'));
}

function watch() {
	gulp.watch('dev/pug/**/*.pug', html);
	gulp.watch('dev/img/**/*.*', img);
	// gulp.watch('dev/stylus/**/*.styl', ['stylus']);
	// gulp.watch('dev/js/**/*.js', ['es6']);
	// gulp.watch('dev/coffee/**/*.coffee', ['coffee']);
}

exports.clear = clear;
// exports.sprite = sprite;
exports.move = gulp.parallel(moveFont, moveJS);
exports.build = gulp.series(html);
exports.default = gulp.parallel(sync, html, img, watch);