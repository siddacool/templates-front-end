var gulp = require('gulp'),
    
    //css related
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    combineMq = require('gulp-combine-mq'),
    
    //js related
    uglify = require('gulp-uglify'),
    
    //sever related
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync'),
    
    //Shared and misc
    cheerio = require('gulp-cheerio'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    rename = require('gulp-rename'),
    
    //error controll
    plumber = require('gulp-plumber');

var public = 'public',
    private = 'private',
    views = 'views';

// server connection
var ipServer = 'http://localhost:',
    port = 8080,
    server = ipServer + port;
// nodemon task
gulp.task('start', function () {
  nodemon({
    script: './bin/www'
  })
})

gulp.task('browser-sync', function() {
    browserSync({
        proxy: server,
        port: 3001,
        open: true,
        notify: false,
        files: [views + '/**/**/*.ejs', public + '/css/*.css', public + '/img/*.png', public + '/js/*.js']
    });
});
    

// scssToCss
gulp.task('scssToCss', function () {
    gulp.src(private + '/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(plumber())
        .pipe(prefix('last 4 versions'))
        .pipe(combineMq({
            beautify: true
        }))
        .pipe(sourcemaps.write('../sourceMaps_css'))
        .pipe(gulp.dest(public + '/css/'));
});

// js compress
gulp.task('jsComp', function() {
  return gulp.src(private + '/scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(public + '/js'));
});


/* svg sprites */
/* type 'gulp svgstore' in console */
var path = require('path');

gulp.task('svgstore', function () {
    return gulp
        .src(private + '/svgAssets/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
            }
        }))
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(gulp.dest(views + '/partials'));
});

/* Watch for changes */
/* Generic */
gulp.task('watch', function () {
    gulp.watch(private + '/scss/**/*.scss', ['scssToCss']),
    gulp.watch(private + '/scripts/*.js', ['jsComp']);
});

/* Default Gulp task */
/* type Gulp in console */
/*gulp.task('default', ['scssToCss', 'browser-sync', 'jsComp' , 'watch']);*/

// with server
gulp.task('default', ['start','scssToCss', 'jsComp' ,'browser-sync', 'watch']);