/**
 * Created by Administrator on 2017/7/27.
 */
//   将项目中个模块的js和css合并到一起
var gulp = require('gulp');
var uglify = require('gulp-uglify'); // js压缩
var del = require('del'); // 删除
var connect = require('gulp-connect');
var sequence = require('gulp-sequence');
var rename = require('gulp-rename'); // 重命名

//--------------------------------------- develop --------------------------------

// 本地热加载
gulp.task('reload', function () {
  gulp.src('dev/ringPic.html')
    .pipe(connect.reload());
});
// 本地监视文件
gulp.task('watch', function () {
  gulp.watch([
    'dev/js/ringPic.js',
    'dev/ringPic.html'
  ], ['reload']);
});

// 本地服务器
gulp.task('server', function () {
  connect.server({
    root: './',
    port: 9090,
    livereload: true
  });
});
// 本地开发任务
gulp.task('dev',sequence('watch','server'));

// build 生产 -----------------------------------------------------

// 清楚原来dist中的文件
gulp.task('clean', function (cb) {
  del(['dist/**/*']).then(function () {
    cb();
  });
});

// 合并压缩js并生成hash文件 开发环境不压缩
gulp.task('buildJs', function () {
  return gulp
    .src('dev/js/ringPic.js')
    .pipe(gulp.dest('dist'))      //- 输出文件本地
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist'));
});
gulp.task('build',sequence('clean','buildJs'));

