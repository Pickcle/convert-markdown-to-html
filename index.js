var path = require('path')
var fs = require('fs')
var execSync = require('child_process').execSync
var showdown = require('showdown')
showdown.setFlavor('github')
var converter = new showdown.Converter()
var config = require('./config.js')
var publishPath = config.PUBLISH_PATH

// execSync(`cp index.css ${publishPath}`)

function convert (srcPath, destPath) {
  fs.readdir(srcPath, function (err, files) {
    files.forEach((file, index) => {
      var date = file.match(/\d+-\d+-\d+/)[0]
      var fileName = file.match(/\d+-\d+-\d+-(.*)/)[1]
      var title = file.match(/\d+-\d+-\d+-(.*)\.markdown/)[1]

      fs.readFile(`${srcPath}/${file}`, (err, data) => {
        var text = data.toString()
        text = text.replace(/---(\n.*){4}\n---/, `### ${date}`)
        var html = converter.makeHtml(text)

        fs.readFile('index.html', (err, indexData) => {
          var indexText = indexData.toString()
          indexText = indexText.replace(/{{ title }}/g, title)
          indexText = indexText.replace('{{ content }}', html)

          if (!fs.existsSync(destPath)) {
            fs.mkdir(destPath, (err) => {
              console.log(err)
            })
          }

          fs.writeFile(`${publishPath}/${title}.html`, indexText, (err) => {
            if (err) {
              console.log(`build failed: ${title}.html, ${err}`)
            } else {
              console.log(`build succeeded: ${title}.html`)
            }
          })
        })
      })
    })
  })
}

module.exports = exports = convert
