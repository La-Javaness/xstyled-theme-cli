const fs = require('fs')

const removeDirectory = (path, recursive = true) => {
	if (fs.existsSync(path)) {
		fs.rmdirSync(path, { recursive })
	}
}

module.exports = removeDirectory
