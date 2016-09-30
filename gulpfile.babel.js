const eslint = require('gulp-eslint');
const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const KarmaServer = require('karma').Server;
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const webpackClientConfig = require('./resources/client/webpack/webpack-client.config.js');


gulp.task('watch', () => {
  nodemon({
    script: './bin/server.js',
    ext: 'js scss html json',
    watch: [
      'bin',
      'resources/client',
      'resources/server/config',
      'resources/server/view',
      'src'
    ],
    env: {
      NODE_ENV: 'local',
      NODE_CONFIG_DIR: './resources/server/config'
    },
    tasks: () => {
      return [];
    }
  });
});

gulp.task('build-client', () => gulp.src(['./src/client/app.jsx','./src/client/**/*.jsx'])
  .pipe(webpack(webpackClientConfig))
  .pipe(gulp.dest('./resources/server/public')));

gulp.task('build', (done) => {
  runSequence('build-client', done);
});

gulp.task('eslint', () => {
  const jsFiles = [
    './**/*.js',
    './**/*.jsx',
    '!./node_modules/**/*.js',
    '!./out/**/*.js',
    '!./out/**/*.jsx',
    '!./resources/server/public/**/*.js',
    '!./target/**/*.js'
  ];
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('testServer', () => {
  process.env.NODE_CONFIG_DIR = './test-resources/server/config';

  gulp.src('./src/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());

  return gulp.src('./test/**/*Spec.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports({
      dir: './target/coverage/server',
      reporters: ['lcov']
    }));
});

gulp.task('testPublic', (done) => {
  new KarmaServer({
    configFile: `${__dirname}/test-resources/client/karma.conf.js`,
    singleRun: true
  }, done).start();
});

gulp.task('test', (done) => {
  runSequence('eslint', 'testServer', 'testPublic', done);
});
