  
var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); 


gulp.task('css',function() {
    gulp.src(["./src/scss/*.scss"])
    .pipe($.sass())
    .pipe($.autoprefixer('last 2 versions'))
    .pipe(gulp.dest('./dist/css/'))    
});
gulp.task('watch', function () {
    $.watch(['./src/scss/*.scss'], $.batch(function (events, done) {
        gulp.start('css', done);
    }));
});









