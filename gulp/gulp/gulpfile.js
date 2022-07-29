
const gulp = require('gulp')
const browsersync = require('browser-sync').create()
const rename = require('gulp-rename')
const del = require('del')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const size = require('gulp-size')
const newer = require('gulp-newer')
const fileinclude = require('gulp-file-include')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const replace = require('gulp-replace');

// ftp
const util = require('gulp-util');
const vinylFTP = require('vinyl-ftp');

// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
	root: {
		project: '',
		proxy: 'https://wp-kremlin/',
		server: '',
	},
	html: {
		// src: ['src/**/*.html', 'src/**/*.pug'],
		watch: ['src/**/*.pug'],
		src: ['src/pug/*.pug'],
		dest: 'dist/'
	},
	styles: {
		src: 'src/styles',
		dest: 'dist/assets/css'
	},
	scripts: {
		src: 'src/scripts',
		dest: 'dist/assets/js'
	},
	fonts: {
		src: 'src/assets/fonts/*',
		dest: 'dist/assets/fonts/'
	},
	images: {
		src: 'src/assets/img/**/*',
		dest: 'dist/assets/img/'
	}
}


// Задача слежки за файломи
function watch() {
	// browsersync
	browsersync.init({
		// html
		// server: { baseDir: "./dist" },

		// local server
		proxy: paths.root.proxy,

		// файлы за которыми следит
		files: [
			// только перезагружать после изменения
			// `../wp-content/themes/web-nn/**/*`,

			// перезагружать после изменения или добавление новых файлов
			paths.html.dest,
			{
				// match: `../**/*`,
				match: `../wp-content/themes/web-nn/**/*`,
				fn() {
					this.reload()
				},
			},
		],
	});

}

// deploy
const deploy = () => {
	let configFTP = {
		host: 'web-nn.ru', // Адрес FTP сервера
		user: "webnn", // Имя пользователя
		password: "PfOTloZucB", // Пароль
		parallel: 5, // Кол-во одновременных потоков
		log: util.log // логи
	}

	const ftpConnect = vinylFTP.create(configFTP);
	return gulp.src(`./app/**/*.*`, {})
	.pipe(plumber(
		notify.onError({
			title: "FTP",
			message: "Error: <%= error.message %>"
		}))
	)
	.pipe(ftpConnect.dest(`/web/test`));
}



// Таск, который выполняется по команде gulp
const build = gulp.series(deploy, watch)







// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.

exports.watch = watch
exports.deploy = deploy
exports.build = build
exports.default = build
