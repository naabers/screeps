var gulp = require("gulp");
var screeps = require("gulp-screeps");
var credentials = require("./credentials.js");

gulp.task("screeps", function(done) {
  gulp.src("*.js").pipe(screeps(credentials));
  done();
});
