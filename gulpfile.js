/**
 * Created by Administrator on 2017/7/27.
 */
//   将项目中个模块的js和css合并到一起
var gulp = require('gulp');
var concat = require('gulp-concat'); // 文件合并
var uglify = require('gulp-uglify'); // js压缩
var minify = require('gulp-minify-css'); // css-prev 压缩
var del = require('del'); // 删除

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var connect = require('gulp-connect');
var sequence = require('gulp-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename'); // 重命名

//--------------------------------------- develop --------------------------------
var path = 'src/js/components/';
var allJs = [
  path + 'jquery.thumbImage.js',

  // options
  path + 'sub_option.js',
  path + 'main_option.js',
  path + 'option_view.js'
];
//----  develop

// 编译sass
gulp.task('compileSass', function () {
  return gulp.src(['src/sass/custom_option.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});
// 监视 sass
gulp.task('watchSass', function () {
  gulp.watch('src/sass/**/*.scss', ['compileSass']);
});

// 合并压缩jj
gulp.task('concatJs', function () {
  return gulp
    .src(allJs)
    .pipe(sourcemaps.init())
    .pipe(concat("custom_option.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));         //- 输出文件本地
});
// 监视js
gulp.task('watchJs',function () {
  gulp.watch('src/js/**/*.js', ['concatJs']);
});

// 本地热加载
gulp.task('reload', function () {
  gulp.src('demo/option.html')
    .pipe(connect.reload());
});
// 本地监视文件
gulp.task('watch', function () {
  gulp.watch([
    'dist/*.css',
    'dist/*.js'
  ], ['reload']);
});

gulp.task('sass', sequence('compileSass', 'watchSass'));
gulp.task('js',sequence('concatJs','watchJs'));
// 清楚原来custom_view.js 文件
gulp.task('cleanDevJs', function (cb) {
  del(['develop/customView/js/custom_view.js']).then(function () {
    cb();
  });
});

// 本地服务器
gulp.task('server', function () {
  connect.server({
    root: './',
    port: 8080,
    livereload: true
  });
});
// 本地开发任务
gulp.task('dev',sequence('sass','js','watch','server'));

// build 生产 -----------------------------------------------------

// 清楚原来dist中的文件
gulp.task('clean', function (cb) {
  del(['dist/**/*']).then(function () {
    cb();
  });
});

// 合并压缩css并生成hash文件
gulp.task('buildCss', function () {
  return gulp.src(['src/sass/custom_option.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      // browserslist: [ "> 5%", "last 2 versions","ie 9"]
    })]))
    .pipe(gulp.dest('dist'))
    .pipe(minify())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('dist'));
});

// 合并压缩js并生成hash文件 开发环境不压缩
gulp.task('buildJs', ['concatJs'], function () {
  return gulp
    .src(allJs)
    .pipe(concat("custom_option.js"))
    .pipe(gulp.dest('dist'))      //- 输出文件本地
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist'));
});
gulp.task('build',sequence('clean','buildCss','buildJs'));

