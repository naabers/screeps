var gulp = require("gulp");
var screeps = require("gulp-screeps");
var credentials = require("./credentials.js");

gulp.task("screeps", async function() {
  gulp.src("*.js").pipe(screeps(credentials));
});
