/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const path    = require('path');
const exec    = require('child_process').exec;

const gulp    = require('gulp');
const connect = require('gulp-connect');

gulp.task('serve', function () {
  const rootPath = path.join(__dirname, 'docs');
  connect.server({
    root: [rootPath],
    port: 8001,
    name: 'HF docs',
    livereload: true,
    middleware: function (connect, opt) {
      return [
        connect().use('/heringsfish-cli', connect.static(rootPath))
      ];
    }
  });
});

gulp.task('watch', function () {
  gulp.watch('./website/content/**/*.md', ['build']);
});

gulp.task('build', function (done) {
  exec('./node_modules/.bin/generate-md --layout ./website/layout --input ./website/content --output ./docs', (err, stdout, stderr) => {
    console.log(stdout);
    if (stderr) {
      console.log(stderr);
    }
    done(err);
  });
  connect.reload();
});

gulp.task('default', ['build', 'serve', 'watch']);
