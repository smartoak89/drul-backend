var gulp = require('gulp'),
    jade = require('gulp-jade');
// Jade
gulp.task('jade', function(){
    gulp.src('./views/admin/admin.jade')
        .pipe(jade())
        .pipe(gulp.dest('./views/html'))
});
// Watch
gulp.task('watch', function(){
    gulp.watch('./template/*.jade',['jade']);
});