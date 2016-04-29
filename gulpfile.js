var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var htmlify = require('gulp-angular-htmlify');
var compressor = require('gulp-compressor');
var angularTemplateCache = require('gulp-angular-templatecache');
var addStream = require('add-stream');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

var baseDirs = {
  root: './',
  dist: './build/',
  app: './src/client/',
  rootSrcServer: './src/server/'
};

var publicDirs = {
  js: 'build/js/',
  css: 'build/css/',
  img: 'build/images/'
};

var bowerComponentsDir = baseDirs.root + 'bower_components/';

// Bower components first!
var appFiles = {
  js: [
    bowerComponentsDir + 'jquery/dist/jquery.min.js', // source bower
    bowerComponentsDir + 'tether/dist/js/tether.js',
    bowerComponentsDir + 'angular/angular.min.js', // source bower
    bowerComponentsDir + 'angular-route/angular-route.min.js', // source bower
    bowerComponentsDir + 'bootstrap/dist/js/bootstrap.min.js', // source bower
    // bowerComponentsDir + 'angular-ui-router/release/js/angular-ui-router.min.js', // source bower
    baseDirs.app + 'assets/js/*.js', // static js
    baseDirs.app + '*.js', // main app js
    baseDirs.app + '**/*.js', // controller, service js
  ],
  css: [
    bowerComponentsDir + 'bootstrap/dist/css/bootstrap.min.css', // source css
    bowerComponentsDir + 'tether/dist/js/tether.min.css',
    baseDirs.app + 'assets/css/**/*.css' // 
  ],
  index: [
    baseDirs.app + 'views/*.html'
  ]
};

var concatFilenames = {
  js: 'all.min.js',
  css: 'all.min.css'
};

var startupScript = 'server.js';
 
function prepareTemplates() {
  return gulp.src(baseDirs.app+'views/**/*.html')
  	.pipe(htmlify())
    .pipe(minifyHTML({empty: true}))
    .pipe(angularTemplateCache({
      module:'appTemplates', 
      standalone: true, 
      root: 'views/'
    }));
}


gulp.task('clean', function() {
  return gulp.src(baseDirs.dist, {read: false}).pipe(clean());
});

gulp.task('dev:imageminify', () => {
  return gulp.src(baseDirs.app + 'assets/images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(publicDirs.img));
});

gulp.task('dev:concatjs', function () {
  return gulp.src(appFiles.js)
    .pipe(uglify())
    .pipe(addStream.obj(prepareTemplates()))
    .pipe(concat(concatFilenames.js))
    .pipe(gulp.dest(baseDirs.root + publicDirs.js));
});

gulp.task('dev:concatcss', function () {
  return gulp.src(appFiles.css)
    .pipe(minifyCss())
    .pipe(concat(concatFilenames.css))
    .pipe(gulp.dest(baseDirs.root + publicDirs.css));
});

gulp.task('dev:minifyhtml', function() {
  var filesToMove = [
      baseDirs.app+'views/index.html',
    ];
  return gulp.src(filesToMove, { base: baseDirs.app +'views/' })
    .pipe(htmlify())
    .pipe(minifyHTML({empty: true}))
    .pipe(gulp.dest(baseDirs.dist))
});

gulp.task('livereload', ['dev:concatjs', 'dev:concatcss','dev:minifycss','dev:minifyjs', 'dev:minifyhtml','dev:imageminify'], function () {
  return gulp.src(appFiles.index)
    .pipe(livereload());
});

gulp.task('live', function () {
  livereload.listen();
  gulp.watch([
      appFiles.js,
      appFiles.css,
      appFiles.index
    ], ['livereload'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('dev:minifycss', function() {
  return gulp.src(baseDirs.app + publicDirs.css + concatFilenames.css)
    .pipe(minifyCss())
    .pipe(gulp.dest(baseDirs.dist + publicDirs.css));
});

gulp.task('dev:minifyjs', function() {
  return gulp.src(baseDirs.app + publicDirs.js + concatFilenames.js)
    .pipe(uglify())
    .pipe(gulp.dest(baseDirs.dist + publicDirs.js));
});


gulp.task('default', ['dev:concatjs', 'dev:concatcss', 'dev:minifyhtml']);
gulp.task('build', ['dev:concatjs', 'dev:concatcss', 'dev:minifycss', 'dev:minifyjs', 'dev:minifyhtml','dev:imageminify']);
gulp.task('production', function() {
  runSequence(
    'dev:concatjs', 'dev:concatcss', 'dev:minifycss', 'dev:minifyjs', 'dev:minifyhtml','dev:imageminify',
    function() {
      gutil.log(gutil.colors.magenta('Your application ready for production'));
      gutil.beep();
    });
});








