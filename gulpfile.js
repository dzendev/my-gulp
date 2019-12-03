const gulp            = require('gulp');
const del             = require('del');
const pug             = require('gulp-pug');
const plumberNotifier = require('gulp-plumber-notifier');
const htmlReplace     = require('gulp-html-replace');
const pipeIf          = require('gulp-if');
const browserSync     = require('browser-sync');
const env             = process.env.NODE_ENV;

function clear() {
	return del(['build/*']);
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

function watch() {
	gulp.watch('dev/pug/**/*.pug', html);
}

exports.clear = clear;
exports.html = html;
exports.build = gulp.series(html);
exports.default = gulp.parallel(sync, html, watch);