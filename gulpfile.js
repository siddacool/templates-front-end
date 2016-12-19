var gulp = require('gulp'),
    
    //css related
    sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	prefix = require('gulp-autoprefixer'),
    combineMq = require('gulp-combine-mq'),
    
    //Html related
    nunjucksRender = require('gulp-nunjucks-render'),
    
    //sever related
    browserSync = require('browser-sync'),
    
    //Shared and misc
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    rename = require('gulp-rename'),
    data = require('gulp-data'),
    
    //error controll
    plumber = require('gulp-plumber');

var projectName = 'projectName';


/* live reload */
gulp.task('browser-sync', function () {
   var files = [
      projectName + '/*.html',
      projectName + '/css/*.css',
      projectName + '/img/*.png',
      projectName + '/js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './' + projectName
      }
   });
});

/* style related components */
/* scss css */

// scssToCss
gulp.task('scssToCss', function () {
    gulp.src(projectName + '/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(plumber())
        .pipe(combineMq({
            beautify: false
        }))
        .pipe(prefix('last 4 versions'))
        .pipe(sourcemaps.write('../sourceMaps_css'))
        .pipe(gulp.dest(projectName + '/css/'));
});

// nunjucks to html
gulp.task('nunjucks', function() {
 nunjucksRender.nunjucks.configure([projectName + '/nunjucks_templates/'],{ watch: false });

  // Gets .html and .nunjucks files in pages
  return gulp.src(projectName + '/nunjucks_pages/*.nunjucks')
  // Renders template with nunjucks
  .pipe(nunjucksRender())
  // output files in app folder
  .pipe(gulp.dest(projectName))
  
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


/* Watch for changes */
/* Generic */
gulp.task('watch',function(){
	gulp.watch(projectName + '/scss/**/*.scss',['scssToCss']);
	gulp.watch(projectName + '/nunjucks_pages/*.nunjucks',['nunjucks']);
	gulp.watch(projectName + '/nunjucks_templates/**/*.nunjucks',['nunjucks']);
});


/* Default Gulp task */
/* type Gulp in console */
gulp.task('default', ['scssToCss','browser-sync','nunjucks','watch']);

