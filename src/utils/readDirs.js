const path = require('path')
const readDir = require('./readDir')

const readAndMap = async (dirPath) => (await readDir(dirPath)).map((filename) => path.join(dirPath, filename))

/**
 * Reads multiple directories and exposes the list of files in those directories
 * in a promise. Unlike `readDir`, files are provided with an absolute path to
 * distinguish each input directory.
 * @param   {string[]} dirPaths The paths of the directories to read.
 * @returns {string[]} 				  The full paths of files found in the directories.
 */
module.exports = async (dirPaths) => {
	const pathArrays = await Promise.all(dirPaths.map((dirPath) => readAndMap(dirPath)))
	return pathArrays.flat()
}
