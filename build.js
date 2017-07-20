const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync

const showdown = require('showdown')

showdown.setFlavor('github')
const converter = new showdown.Converter()

const config = require('./config.js')
const sourcePath = config.MARKDOWN_SOURCE_PATH
const publishPath = config.PUBLISH_PATH

execSync(`cp index.css ${publishPath}`)

fs.readdir(sourcePath, function (err, files) {
  files.forEach((file, index) => {
    const date = file.match(/\d+-\d+-\d+/)[0]
    const fileName = file.match(/\d+-\d+-\d+-(.*)/)[1]
    const title = file.match(/\d+-\d+-\d+-(.*)\.markdown/)[1]

    fs.readFile(`${sourcePath}/${file}`, (err, data) => {
      let text = data.toString()
      text = text.replace(/---(\n.*){4}\n---/, `### ${date}`)
      const html = converter.makeHtml(text)

      fs.readFile('index.html', (err, indexData) => {
        let indexText = indexData.toString()
        indexText = indexText.replace(/{{ title }}/g, title)
        indexText = indexText.replace('{{ content }}', html)

        if (!fs.existsSync(publishPath)) {
          fs.mkdir(publishPath, (err) => {
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
