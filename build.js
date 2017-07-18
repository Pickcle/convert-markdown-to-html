const path = require('path')
const fs = require('fs')

const showdown = require('showdown')

showdown.setFlavor('github')
const converter = new showdown.Converter()

const sourcePath = 'blogs'

const publishPath = 'dist'

fs.readdir(sourcePath, function (err, files) {
  files.forEach((file, index) => {
    fs.readFile(`${sourcePath}/${file}`, (err, data) => {
      const text = data.toString()
      // const title = text.match(/title:\s{2}"(\w+)"/)
      const html = converter.makeHtml(text)

      // console.log(html)

      fs.readFile('index.html', (err, indexData) => {
        const indexText = indexData.toString()
        const outputText = indexText.replace('{{ content }}', html)

        if (!fs.existsSync(publishPath)) {
          fs.mkdir(publishPath, (err) => {
            console.log(err)
          })
        }

        fs.writeFile(`${publishPath}/${file}.html`, outputText, (err) => {
          // console.log(outputText)
        })

      })
    })
  })

  console.log(files)
})
