const del              = require('del');
const gulp             = require('gulp');
const pipeIf           = require('gulp-if');
const pug              = require('gulp-pug');
const plumberNotifier  = require('gulp-plumber-notifier');
const htmlReplace      = require('gulp-html-replace');
const image64          = require('gulp-image64');
const inlineCss        = require('gulp-inline-css');
const rewriteImagePath = require('gulp-rewrite-image-path');
const imagemin         = require('gulp-imagemin');
const spritesmith      = require('gulp.spritesmith');
const svgSprite        = require('gulp-svg-sprite');
const inlineFonts      = require('gulp-inline-fonts');
const buffer           = require('vinyl-buffer');
const newer            = require('gulp-newer');
const stylus           = require('gulp-stylus');
const gcmq             = require('gulp-group-css-media-queries');
const rename           = require('gulp-rename');
const cssnano          = require('gulp-cssnano');
const uncss            = require('gulp-uncss-sp');
const nib              = require('nib');
const rupture          = require('rupture');
const jeet             = require('jeet');
const glob             = require('glob');
const babel            = require('gulp-babel');
const uglify           = require('gulp-uglify');
const	coffee           = require('gulp-coffee');
const iconfont         = require('gulp-iconfont');
const iconfontCss      = require('gulp-iconfont-css');
const webpack          = require('webpack-stream');
const browserSync      = require('browser-sync');
const sass             = require('gulp-sass');
sass.compiler          = require('node-sass');
const env              = process.env.NODE_ENV;

function clear() {
	return del(['build/*']);
}

function moveFont() {
	return gulp.src('dev/lib/fonts/*')
		.pipe(newer('build/fonts'))
		.pipe(gulp.dest('build/fonts'));
}

function moveJs() {
	return gulp.src([
			'dev/lib/js/*.js',
			'./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/@babel/polyfill/dist/polyfill.min.js'
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

function pugToHtml() {
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

function html() {
	return gulp.src('dev/html/*.html')
		.pipe(plumberNotifier())
		.pipe(pipeIf(env === 'production', htmlReplace({
			css: 'css/style.min.css',
			js_app: 'js/app.min.js',
			js_script: 'js/script.min.js'
		})))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
}

function email() {
	return gulp.src(['build/index.html'])
		.pipe(rewriteImagePath({path:"build"}))
		.pipe(inlineCss())
		.pipe(image64())
		.pipe(gulp.dest('build/email'));
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

function stylusToCss() {
	return gulp.src(['dev/stylus/**/*.styl', '!dev/stylus/**/_*.styl'])
		.pipe(plumberNotifier())
		.pipe(stylus({ use: [nib(), rupture(), jeet()], 'include css': true}))
		.pipe(pipeIf(env === 'production', uncss({
				// html: ['./build/index.html']
				html: glob.sync('./build/**/*.html')
		})))
		.pipe(pipeIf(env === 'production', gcmq()))
		.pipe(pipeIf(env === 'production', cssnano()))
		.pipe(pipeIf(env === 'production', rename({suffix: '.min'})))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({ stream: true }));
}

function sassToCss() {
	return gulp.src('dev/sass/**/*.scss')
		.pipe(plumberNotifier())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(pipeIf(env === 'production', uncss({
				// html: ['./build/index.html']
				html: glob.sync('./build/**/*.html')
		})))
		.pipe(pipeIf(env === 'production', gcmq()))
		.pipe(pipeIf(env === 'production', cssnano()))
		.pipe(pipeIf(env === 'production', rename({suffix: '.min'})))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({ stream: true }));
}

function spritePng() {
	var spriteData = gulp.src('dev/img/sprite-png/*.png').pipe(spritesmith({
				imgName: 'sprite.png',
				cssName: '_sprite.styl',
				cssFormat: 'stylus',
				imgPath: '../img/sprite.png'
		}));
		spriteData.img
			.pipe(buffer())
			.pipe(pipeIf(env === 'production', imagemin()))
			.pipe(gulp.dest('build/img'));
		spriteData.css
			.pipe(gulp.dest('dev/stylus'));
}

function spriteSvg() {
	return gulp.src('dev/img/sprite-svg/*.svg')
		.pipe(svgSprite({
			shape: {
				dimension: {
					maxWidth: 64,
					maxHeight: 64
				}
			},
			mode: {
				css: {
					render: {
						css: true,
					},
				}
			}
		}))
		.pipe(gulp.dest('dev/stylus'))
		.on('end', () => {
			gulp.src('dev/stylus/css/svg/*.svg')
				.pipe(imagemin())
				.pipe(gulp.dest('build/css/svg'));
		});
}

function svgToFont() {
	const runTimestamp = Math.round(Date.now()/1000);
	return gulp.src(['dev/img/sprite-svg/*.svg'])
		.pipe(iconfontCss({
			fontName: 'svgfont',
			// path: 'app/assets/css/templates/_icons.scss',
			targetPath: '../../dev/stylus/_svg-font.css',
			fontPath: '../fonts/',
			cssClass: 'svg-font'
		}))
		.pipe(iconfont({
			fontName: 'svgfont', // required
			prependUnicode: true, // recommended option
			formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // default, 'woff2' and 'svg' are available
			timestamp: runTimestamp, // recommended to get consistent builds when watching files
		}))
			.on('glyphs', function(glyphs, options) {
				// CSS templating, e.g.
				console.log(glyphs, options);
			})
		.pipe(gulp.dest('build/fonts/'));
}

function fontBase64() {
	return gulp.src(['dev/lib/fonts/*'])
		.pipe(inlineFonts({ name: 'NairiNormal' }))
		.pipe(gulp.dest('dev/stylus/'));
}

function es6() {
	return gulp.src('dev/js/**/*.js', { sourcemaps: true })
		.pipe(plumberNotifier())
		// .pipe(sourcemaps.init())
		.pipe(pipeIf(env === 'production', babel({
			presets: [
				["env"]
			]
		})))
		.pipe(pipeIf(env === 'production', uglify()))
		.pipe(pipeIf(env === 'production', rename({suffix: '.min'})))
		// .pipe(sourcemaps.write("."))
		.pipe(gulp.dest('build/js', { sourcemaps: true }))
		.pipe(browserSync.reload({ stream: true }));
}

function es6modules() {
	return gulp.src('dev/js/**/*.js')
		.pipe(plumberNotifier())
		.pipe(webpack({
			entry: {
				app: env === 'production' ? ['babel-polyfill', './dev/js/app.js'] : './dev/js/app.js',
				script: './dev/js/script.js'
			},
			mode: env,
			output: {
				filename: '[name].js',
			}
		}))
		.pipe(pipeIf(env === 'production', babel({
			presets: [
				["env", {"modules": false}]
			]
		})))
		.pipe(pipeIf(env === 'production', uglify()))
		.pipe(pipeIf(env === 'production', rename({suffix: '.min'})))
		.pipe(gulp.dest('build/js'))
		.pipe(browserSync.reload({ stream: true }));
}

function coffeeToJs() {
	var configCoffee = {
		bare: true
	};

	if(env === 'production'){
		configCoffee['transpile'] = {
			presets: [
				["env", {"modules": false}]
			]
		};
	}

	return gulp.src('dev/coffee/**/*.coffee')
		.pipe(plumberNotifier())
		.pipe(coffee(configCoffee))
		.pipe(gulp.dest('dev/js'));
}

function watch() {
	// gulp.watch('dev/pug/**/*.pug', pugToHtml);
	gulp.watch('dev/html/**/*.html', html);
	gulp.watch('dev/img/**/*.*', img);
	gulp.watch('dev/stylus/**/*.styl', stylusToCss);
	// gulp.watch('dev/sass/**/*.scss', sassToCss);
	gulp.watch('dev/js/**/*.js', es6);
	// gulp.watch('dev/js/**/*.js', es6modules);
	gulp.watch('dev/coffee/**/*.coffee', coffeeToJs);
}

exports.clear = clear; // очистка папки build
exports.sprite = gulp.parallel(spritePng, spriteSvg); // создание спрайтов png и svg
exports.font = gulp.parallel(svgToFont, fontBase64); // созадние из svg шрифта и преобразование шрифта в base64
exports.move = gulp.parallel(moveFont, moveJs); // перемещение шрифтов и js библиотек
exports.email = email; // генерация email письма из html

const task = [
	// pugToHtml,
	html,
	img,
	stylusToCss,
	// sassToCss,
	// coffeeToJs,
	es6,
	// es6modules
];

exports.build = gulp.series(clear, move, gulp.parallel(...task));
const dev = gulp.parallel(sync, ...task, watch);
exports.dev = dev;
exports.default = dev;