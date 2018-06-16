var gulp = require("gulp");
// 1 清空
var clean = require("gulp-clean");
// 2.1 sass 
var sass = require("gulp-sass");
// 2.2 添加浏览器前缀
var autoprefixer = require("gulp-autoprefixer");

// 3.1 es6 =>  es5
var babel = require("gulp-babel");
// 4.1  合并组件到html页面 
var fileInclude = require("gulp-file-include");
// 5.1 同步执行任务 
var runSequence = require("run-sequence");
// 5.2 自动保存自动编译
var browserSync = require("browser-sync");
/* 
开发版本

1 清空文件夹dist 
2 处理css
  2.1 sass 变成 css 
  2.2 添加浏览器前缀   autoprefixer
3 处理js
  3.1 es6 => es 5 
4 处理html
  4.1 合并公共组件到html页面  
5 其他
  5.1 让任务同步 run-sequence(按顺序执行  异步同时进行)执行 (gulp本来自己是不支持的)
      a) 在需要同步的任务里面 加一个return 
      b) runSequence("clean",["css"],function(){ 成功的回调函数  })
  5.2 文件修改了之后,自动完成编译并且 刷新浏览器   browserSync

6  复制静态资源 第三方的插件 和 本地图片等 
 */



 // 1 清空 
 gulp.task("clean",function () {
  return gulp.src("./dist")
   // 1 清空
   .pipe(clean());
 })

 // 2 css
 gulp.task("css",function () {

  return gulp.src("./src/css/**")
  // 2.1 sass
  .pipe(sass())
  // 2.2 添加浏览器的前缀
  .pipe(autoprefixer({
    // 主流浏览器的最新的两个版本
    browsers: ['last 2 versions']
  }))
  .pipe(gulp.dest("./dist/css"));
 })

 // 3 js
 gulp.task("js",function () {
   return gulp.src("./src/js/**")
    // 3.1 es6 => es5 
   .pipe(babel({
    // 智能选择编译
    presets: ['env']
  }))
  .pipe(gulp.dest("./dist/js"));
 })


 // 4 html
 gulp.task("html",function () {

  return gulp.src("./src/pages/**")
  // 4.1 组合页面 
    .pipe(fileInclude({
      // 预定义前缀
      prefix: "@@",
      // 组件的路径
      basepath: "./src/components"
    }))
    .pipe(gulp.dest("./dist/pages"));
   
 })


 
 // 6 处理静态资源 
 // 6.1 处理 lib 
 gulp.task("lib",function () {
  return gulp.src("./src/lib/**")
  .pipe(gulp.dest("./dist/lib"))
})
// 6.2 处理 static 
gulp.task("static",function () {
  return gulp.src("./src/static/**")
  .pipe(gulp.dest("./dist/static"))
})


 // 5 执行默认任务
 gulp.task("default",function () {
   // 5.1 同步任务
   runSequence("clean",["css","js","html","lib","static"],function () {
    //  console.log("成功");
    // 5.2 自动打开浏览器
    browserSync.init({
      // 服务器设置
      server: {
        // 网站根路径
        baseDir: "./dist",
        // 入口文件
        index: "pages/index.html"
      },
      // 端口号
      port: "8888",
      // 不出现页面提示
      notify: false
    });

    // 5.2 修改之后 自动触发编译
     gulp.watch("./src/css/**", ["css"]).on("change", browserSync.reload);
     gulp.watch("./src/js/**", ["js"]).on("change", browserSync.reload);
     gulp.watch("./src/pages/**", ["html"]).on("change", browserSync.reload);
   })
 })



//  gulp.task("default",["clean","css"],function () {
//    console.log("自己执行");
   
//  })


