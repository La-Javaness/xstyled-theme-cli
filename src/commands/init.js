const init = require('../init')
const { error } = require('../logger')
const resolveDirectories = require('../utils/resolveDirectories')

module.exports = async (args) => {
	try {
		const dirs = resolveDirectories(args)
		await init(dirs, args)
	} catch (err) {
		error(err)
		throw err
	}
}
