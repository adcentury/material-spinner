/**
 *
 *  Forked from Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

'use strict';

import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const paths = {
  dist: {
    base: 'dist',
    js: 'dist/js',
    css: 'dist/css',
    img: 'dist/img',
    fonts: 'dist/fonts',
    'libs': 'dist/libs'
  }
};

// 拷贝相关资源
gulp.task('copy', () => {
  return gulp.src([
    'src/*',
    '!src/js/*',
    '!src/less',
    '!src/*.html'
  ], {
    dot: true
  })
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// 处理js文件
let browserifyOption = {
  cache: {},
  pachageCache: {},
  entries: ['./src/js/material.spinner.js'],
  transform: ['babelify']
};

const bundle = (b) => {
  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('material.spinner.js'))
    .pipe(buffer())
    .pipe($.wrap({src: 'src/js/umd-wrapper.js'}))
    .pipe(gulp.dest(paths.dist.js))
    .pipe($.size({title: 'script'}))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist.js))
    .pipe($.size({title: 'script minify'}));
};

gulp.task('browserify', () => {
  browserifyOption.debug = false;
  const b = browserify(browserifyOption);
  b.transform('browserify-shim', {global: true});
  return bundle(b);
});

gulp.task('watchify', () => {
  browserifyOption.debug = true;
  const b = watchify(browserify(browserifyOption));
  b.transform('browserify-shim', {global: true});
  b.on('update', () => {
    bundle(b);
  }).on('log', $.util.log);
  return bundle(b);
});

// 拷贝依赖库，仅在开发环境中执行
gulp.task('libs', () => {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery/dist/jquery.min.map'
  ], {
    dot: true
  })
    .pipe(gulp.dest((file) => {
      const filePath = file.path.toLowerCase();
      let path = '';
      if(filePath.indexOf('jquery.min') > -1) {
        path = '/js';
      }
      return paths.dist.libs + path;
    }))
      .pipe($.size({title: 'libs'}));
});

// html，仅在开发环境中执行
gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest(paths.dist.base))
    .pipe($.size({title: 'html'}));
});

// 清理输出目录
gulp.task('clean', (cb) => del(['dist/*', '!dist/.git'], {dot: true}, cb));

// 监视文件变化自动编译
gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['html']);
});

gulp.task('serve', () => {
  browserSync({
    notify: false,
    logPrefix: 'SPIN',
    server: 'dist'
  });

  gulp.watch(['dist/**/*'], reload);
});

gulp.task('static', (cb) => {
  runSequence(
    'clean',
    ['copy'],
    cb
  );
});

gulp.task('dev', (cb) => {
  runSequence(
    'static',
    ['watchify', 'html', 'libs'],
    'watch',
    'serve',
    cb
  );
});

// 默认任务
gulp.task('default', (cb) => {
  runSequence(
    'static',
    'browserify',
    cb
  );
});
