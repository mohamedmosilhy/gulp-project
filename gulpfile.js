const gulp = require("gulp"),
  concat = require("gulp-concat"),
  prefix = require("gulp-autoprefixer"),
  sass = require("gulp-sass")(require("sass")),
  pug = require("gulp-pug"),
  livereload = require("gulp-livereload"),
  uglify = require("gulp-uglify"),
  sourcemaps = require("gulp-sourcemaps"),
  notify = require("gulp-notify"),
  zip = require("gulp-zip"),
  ftp = require("vinyl-ftp");

// concat files and add css3 prefix
gulp.task("css", async () => {
  return gulp
    .src("project/*.css")
    .pipe(sourcemaps.init())
    .pipe(prefix("last 2 versions"))
    .pipe(concat("main.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
});

// concat  js files
gulp.task("js", async () => {
  return gulp
    .src("project/js/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(livereload());
});

// concat files, add css3 prefix and compile sass files
gulp.task("sass", async () => {
  return gulp
    .src("project/css/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(prefix("last 2 versions"))
    .pipe(concat("main.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(livereload());
});

// pug files and add the static server
gulp.task("pug", async () => {
  return gulp
    .src("project/index.pug")
    .pipe(sourcemaps.init())
    .pipe(pug({ pretty: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    .pipe(notify("HTML Task Is Done"))
    .pipe(livereload());
});

//compress Task
gulp.task("compress", async () => {
  return gulp
    .src("dist/**/*.*")
    .pipe(zip("archive.zip"))
    .pipe(gulp.dest("."))
    .pipe(notify("compress Task Is Done"));
});

//ftp
gulp.task("deploy", function () {
  var conn = ftp.create({
    host: "mywebsite.tld",
    user: "",
    password: "",
    parallel: 10,
  });

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp
    .src(["dist/**/*.*"], { base: ".", buffer: false })
    .pipe(conn.newer("/public_html")) // only upload newer files
    .pipe(conn.dest("/public_html"))
    .pipe(livereload());
});

// Watch task
gulp.task("watch", async () => {
  require("./server.js");
  livereload.listen();
  gulp.watch("project/js/*.js", gulp.parallel("js"));
  gulp.watch("project/css/**/*.scss", gulp.parallel("sass"));
  gulp.watch("project/**/*.pug", gulp.parallel("pug"));
  gulp.watch("dist/**/*.*", gulp.parallel("compress"));
  //   gulp.watch("dist/**/*.*", gulp.parallel("deploy"));
});
