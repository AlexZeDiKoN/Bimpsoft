'use strict'

const path = require('path')
// В переменные получаем установленные пакеты
const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const svgstore = require('gulp-svgstore')
const rename = require('gulp-rename')
const sort = require('gulp-sort')
const filelist = require('gulp-filelist')

const renameFunc2 = (file) => {
  const path = file.dirname === '.' ? [] : file.dirname.split('\\')
  path.push(file.basename)
  const newNames = path.join('_').replace(/[^\d\w]+/g, '_')
  file.basename = newNames
}

// Создаем svg спрайт
gulp.task('svg-sprite2', () => gulp
  .src([ './src/assets/symbols/**/*.svg', '!./src/assets/symbols/sprite.svg', '!./src/assets/symbols/otherFiles/**/*.svg' ])
  .pipe(rename(renameFunc2))
  .pipe(sort())
  .pipe(
    imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { cleanupIDs: false },
          // { removeAttrs: { attrs: ('fill') } },
          // { removeElementsByAttr: { id: ('bg') } },
        ],
      }),
    ]),
  )
  .pipe(svgstore({
    inlineSvg: true,
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('./src/components/Symbols/')))

// Создаем список имен иконок
gulp.task('svg-list2', () => gulp
  .src([ './src/assets/symbols/**/*.svg', '!./src/assets/symbols/sprite.svg', '!./src/assets/symbols/otherFiles/**/*.svg' ])
  .pipe(rename(renameFunc2))
  .pipe(sort())
  .pipe(filelist('names.js', {
    relative: true,
    removeExtensions: true,
    destRowTemplate: (filePath) => {
      const fileName = path.basename(filePath)
      const name = fileName.replace(/[^\d\w]+/g, '_').toUpperCase()
      return `\r\n// ${filePath}\r\nexport const ${name} = '${fileName}'\r\n`
    },
  }))
  .pipe(gulp.dest('./src/components/symbols/')))

// Таск слежения за изменениями файлов
gulp.task('watch', () => {
  gulp.watch([ './src/assets/img/**/*.*', './src/assets/icons2/**/*.*' ], [ 'images', 'svg-sprite' ])
})
