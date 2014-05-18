var gulp = require('gulp');
var rg = require('./node_modules/rangle-gulp');

var allScripts = [
  'www/app/**/*.js'
];

var coreScripts = [
  'www/app/core/**/*.js'
];

var testVendor = [
  'www/lib/bower-components/angular/angular.min.js',
  'www/lib/bower-components/angular-mocks/angular-mocks.js',
  'www/lib/bower-components/sinon-chai/lib/sinon-chai.js',
  'www/lib/bower-components/lodash/dist/lodash.js',
  'testing/vendor/q.js',
  'testing/tests/*.js',
  'testing/test-utils.js'
];
gulp.task('karma', rg.karma({
  files: allScripts,
  karmaConf: 'karma.conf.js',
  vendor: testVendor
  // karmaConf: specify which karma config file
}));

gulp.task('karma-watch', rg.karmaWatch({
  // files: specify which folders
  // karmaConf: specify which karma config file
}));

gulp.task('lint', rg.jshint({
  files: allScripts
}));

gulp.task('lint-core', rg.jshint({
  files: coreScripts
}));


// gulp.task('dev', rg.nodemon({
//   onChange: ['lint'] // or ['lint', 'karma']
// }));

gulp.task('beautify', rg.beautify({
  files: allScripts,
  configFile: '.jsbeautifyrc'
}));

gulp.task('sass', function () {
  rg.sass({
    source: './www/scss/app.scss',
    destination: './www/css'
  })
});

// Example dev task if you are building a Cordova app
gulp.task('dev', function () {
  // Watch sass files
  // re-compile sass and minify css
  gulp.watch([
    './www/scss/**/*.scss',
    './www/scss/*.scss'
  ], ['sass']);

  // Start a connect server
  // Watch for changes to html & js files
  // Re-load browser (make sure you install live-reload 
  // extension for your browser)
  rg.connectWatch({
    root: 'www',
    port: 3000,
    livereload: true,
    // Files to watch for live re-load
    glob: ['./www/**/*.html', './www/**/*.js']
  });
});

gulp.task('default', ['dev']);