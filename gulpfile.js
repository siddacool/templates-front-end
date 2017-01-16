var gulp = require('gulp'),
    
    //css related
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    combineMq = require('gulp-combine-mq'),
    
    //Html related
    nunjucksRender = require('gulp-nunjucks-render'),
    
    //js related
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    
    //sever related
    browserSync = require('browser-sync'),
    
    //Shared and misc
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    rename = require('gulp-rename'),
    data = require('gulp-data'),
    
    //error controll
    plumber = require('gulp-plumber');

var projectName = 'projectName',
    dist = 'dist',
    scripts = projectName + '/js',
    componentsLoc = scripts + '/components',
    libjsLoc = scripts + '/lib';


/* live reload */

// sync list
var syncList = [
    dist + '/*.html',
    dist + '/css/*.css',
    dist + '/img/*.png',
    dist + '/js/*.js'
];

gulp.task('browser-sync', function () {
   var files = syncList;

   browserSync.init(files, {
      server: {
         baseDir: './' + dist
      },
      open: false
   });
});

gulp.task('browser-sync-open-browser', function () {
   var files = syncList;

   browserSync.init(files, {
      server: {
         baseDir: './' + dist
      }
   });
});

/* style related components */
/* scss css */

// Browser list
var browserList = [
    "chrome 40",
    "edge 13",
    "firefox 40",
    "ios_saf 7",
    "safari 8"
];

// scssToCss
gulp.task('scssToCss', function () {
    gulp.src(projectName + '/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(plumber())
        .pipe(combineMq({
            beautify: true
        }))
        .pipe(prefix(browserList))
        .pipe(sourcemaps.write('../sourceMaps_css'))
        .pipe(gulp.dest(dist + '/css/'));
});

// scssToCssWeb
gulp.task('scssToCssWeb', function () {
    gulp.src(projectName + '/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(plumber())
        .pipe(combineMq({
            beautify: false
        }))
        .pipe(prefix(browserList))
        .pipe(gulp.dest(dist + '/css/'));
});

// nunjucks to html
gulp.task('nunjucks', function () {
    nunjucksRender.nunjucks.configure([projectName + '/nunjucks_templates/'], {
        watch: false
    });

    // Gets .html and .nunjucks files in pages
    return gulp.src(projectName + '/nunjucks_pages/*.nunjucks')
        // Renders template with nunjucks
        .pipe(nunjucksRender())
        // output files in app folder
        .pipe(gulp.dest(dist + '/'))

});
// js compress
var baseJs = [
    scripts + '/sys-var.js',
    scripts + '/baseFunctions.js'
];
var libJs = [
    libjsLoc + '/example-lib.js',
];
var componentsJsFiles = [
    componentsLoc + '/exampleComponent.js',
];

var componentsStart = [componentsLoc + '/componentsStart.js'],
    componentsEnd = [componentsLoc + '/componentsEnd.js'],
    componentsJsOpen = componentsStart.concat(componentsJsFiles),
    componentsJs = componentsJsOpen.concat(componentsEnd),
    libjsCombine = baseJs.concat(libJs),
    combineJs = libjsCombine.concat(componentsJs);

gulp.task('jsCompress', function () {
    gulp.src(combineJs)
        .pipe(concat('app.js'))
        .pipe(plumber())
        .pipe(gulp.dest(dist + '/js/'));
});


/* svg sprites */
/* type 'gulp svgstore' in console */
var path = require('path');

gulp.task('svgstore', function () {
    return gulp
        .src(projectName + '/svgAssets/*.svg')
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
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(gulp.dest(projectName + '/fonts'))
        .pipe(gulp.dest(projectName + '/nunjucks_templates/partials/'));
});

// copy paste content of public folder to dist
gulp.task('public', function () {
    gulp.src(projectName + '/public/*/*.**')
        .pipe(plumber())
        .pipe(gulp.dest(dist + '/'));
});
gulp.task('publicBase', function () {
    gulp.src(projectName + '/public/*.**')
        .pipe(plumber())
        .pipe(gulp.dest(dist + '/'));
});


/* Watch for changes */
/* Generic */
gulp.task('watch', function () {
    gulp.watch(projectName + '/scss/**/*.scss', ['scssToCss']);
    gulp.watch(projectName + '/nunjucks_pages/*.nunjucks', ['nunjucks']);
    gulp.watch(projectName + '/nunjucks_templates/**/*.nunjucks', ['nunjucks']);
    gulp.watch(scripts + '/**/*.js', ['jsCompress']);
});


/* Default Gulp task */
/* type Gulp in console */
gulp.task('default', ['scssToCss','browser-sync','nunjucks','public','publicBase','jsCompress','watch']);
gulp.task('web', ['scssToCssWeb','browser-sync','nunjucks','public','publicBase','jsCompress','watch']);
gulp.task('openbrowser', ['scssToCss','browser-sync-open-browser','public','publicBase','nunjucks','jsCompress','svgstore','watch']);

