const fs = require('fs')

/**
 * Reads a directory and exposes the result as a Promise instead of requiring
 * a callback.
 * @param  {string} dirPath The path of the directory to read.
 * @returns {string[]} 				The filenames of files found in the directory.
 */
module.exports = (dirPath) => {
	return new Promise((resolve, reject) => {
		fs.readdir(dirPath, async (error, files) => {
			if (error) {
				reject(`Failed to scan directory '${dirPath}': ${error}`)
			}

			resolve(files)
		})
	})
}
