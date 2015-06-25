/**
 * Concat external JS libs.
 *
 * ---------------------------------------------------------------
 *
 * Takes all the includes from pipeline.jsLibs and creates a special
 * package containing them. This is separate from the app code to
 * increase cachability (app code is updated more often than lib code).
 *
 */
var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    libs = require('../pipeline').jsLibs;

module.exports = function(gulp, plugins, growl) {

  var b = browserify({debug: false});

  libs.forEach(function(lib) {
    b.require(lib);
  });

  gulp.task('js:libs', function() {
    return b.bundle()
      .on('error', plugins.util.log.bind(plugins.util, 'Browserify error'))
      .pipe(source('libs.js'))
      .pipe(buffer())
      .pipe(gulp.dest('.tmp/public/js/'))
      .pipe(plugins.if(growl, plugins.notify({
        message: 'js:libs task complete'
      })));
  });

};
