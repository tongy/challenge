  
var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); 

//构建插件 
// var sass = require('gulp-sass'),
//     concat = require('gulp-concat'),
//     iconfont = require('gulp-iconfont'),
//     filter = require('gulp-filter'),
//     sourcemaps = require('gulp-sourcemaps'),
//     prefix = require('gulp-autoprefixer'),
//     cssmin = require('gulp-cssmin'),
//     rename = require('gulp-rename'),
//     notify = require('gulp-notify'),
//     livereload = require('gulp-livereload');

gulp.task('css', function (callback) {
    $.runSequence('lib','card', callback);
});
gulp.task('mincss', function (callback) {
    $.runSequence('minlib','mincard', callback);
});
gulp.task('lib',function() {
    gulp.src(["./src/scss/lib/*.scss"])
    .pipe($.sass())
    .pipe($.autoprefixer('last 2 versions'))
    .pipe(gulp.dest('./dist/css/lib/'))    
});
gulp.task('minlib',function() {
    gulp.src(["./dist/css/lib/base.css"])
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css/lib/'))
});
gulp.task('card',function() {
    gulp.src(["./src/scss/card/*.scss"])
    .pipe($.sass())
    .pipe($.autoprefixer('last 2 versions'))
    .pipe(gulp.dest('./dist/css/card/')) 
    .pipe($.concat('cards.css'))
    .pipe(gulp.dest('./dist/css/card'))    
});
gulp.task('mincard',function() {
    gulp.src(["./dist/css/card/cards.css"])
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css/card/'))
});
gulp.task('watch', function () {
    $.watch(['./src/scss/lib/*.scss', './src/scss/card/*.scss'], $.batch(function (events, done) {
        gulp.start('css', done);
    }));
});








//生成字体
gulp.task('font', function() {
   gulp.src(['src/font/*.svg'])
    .pipe($.iconfont({
      fontName: 'marvelfont', // required 
      appendCodepoints: true, // recommended option,
      round : 10e0 //Path保留小数位（保留小数点一位）
      // descent: -212,  // ascent = fontHeight - descent.
      // fontHeight: 1024,
      // normalize:true
    }))
      .on('codepoints', function(codepoints, options) {
        // CSS templating, e.g. 
        console.log(codepoints, options);
      })
    .pipe(gulp.dest('dist/font/'));
});





//svg合成

// gulp.task('svg',function() {
//     gulp.src(['./src/svg/*.svg'])
//     .pipe($.svgSprite(
//         {
//             "mode": {
//                 "css": {
//                   spacing : {
//                     padding  : 0,
//                     box  : 'content'
//                   },
//                     "dest": "./",
//                     "layout": "vertical",
//                     "sprite": "img/sprite.svg",
//                     "bust": false,
//                 }
//             }
//         }


//       ))
//     .pipe(gulp.dest('./dist/'))
// });




config                  = {
    shape               : {
        dimension       : {         // Set maximum dimensions 
            maxWidth    : 32,
            maxHeight   : 32
        },
        spacing         : {         // Add padding 
            padding     : 10
        }
    },
    mode                : {
        css             : {
        dest            : './',
        layout          : 'vertical',
        sprite          : 'img/sprite.svg',
        bust            : false
        }
    }
};


gulp.task('svg',function() {
    gulp.src(['./src/svg/*.svg'])
    .pipe($.svgSprite(config))
    .pipe(gulp.dest('./dist/'))
});





gulp.task('js', function () {
    gulp.src(['./src/js/**/*.js'])
        .pipe(gulp.dest('./dist/js'));
});




gulp.task('build', function(callback){
    $.runSequence('css','font','svg','js',callback);
});

var _manifest = 'rev-manifest.json';
var _release = '.release';

gulp.task('rev-assets', function() {
  return gulp.src(['dist/**/*.*', '!dist/**/*.{css,js}'])
    .pipe($.rev())
    .pipe(gulp.dest(_release))
    .pipe($.rev.manifest(_manifest, {
      merge: true
    }))
    .pipe(gulp.dest(''));
});

gulp.task('rev-css', ['rev-assets'], function() {
  var manifest = gulp.src(_manifest);
  return gulp.src('dist/**/*.css')
    .pipe($.revReplace({
      manifest: manifest
    }))
    .pipe($.rev())
    .pipe($.minifyCss())
    .pipe(gulp.dest(_release))
    .pipe($.rev.manifest(_manifest, {
      merge: true
    }))
    .pipe(gulp.dest(''));
});

gulp.task('rev-js', ['rev-assets'], function() {
  var manifest = gulp.src(_manifest);
  return gulp.src('dist/**/*.js')
    .pipe($.revReplace({
      manifest: manifest
    }))
    .pipe($.rev())
    .pipe($.uglify())
    .pipe(gulp.dest(_release))
    .pipe($.rev.manifest(_manifest, {
      merge: true
    }))
    .pipe(gulp.dest(''));
});


gulp.task('rev', [
  'rev-assets',
  'rev-css',
  'rev-js'
]);



