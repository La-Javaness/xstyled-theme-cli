const build = require('../build')
const { error } = require('../logger')
const resolveDirectories = require('../utils/resolveDirectories')

module.exports = async (args) => {
	try {
		const dirs = resolveDirectories(args)
		await build(dirs)
	} catch (err) {
		error(err, false)
		throw err
	}
}
