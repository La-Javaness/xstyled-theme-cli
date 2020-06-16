const fs = require('fs')

const removeDirectory = (path, recursive = true) => fs.rmdirSync(path, { recursive })

module.exports = removeDirectory
