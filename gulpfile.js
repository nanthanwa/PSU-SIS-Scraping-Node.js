var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['index.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

gulp.task('default', function() {
  gulp.start('server');
  gulp.watch(['./index.js', './lib/**/*.js'], ['server']);
})


process.on('exit', function() {
    if (node) node.kill()
})
