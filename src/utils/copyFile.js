const fs = require('fs')

const copyFile = (source, dest) => fs.copyFileSync(source, dest)

module.exports = copyFile
