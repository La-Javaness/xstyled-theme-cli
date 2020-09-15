const list = require('../list')
const { error } = require('../logger')
const resolveDirectories = require('../utils/resolveDirectories')

module.exports = async (args) => {
	try {
		const dirs = resolveDirectories(args)
		await list(dirs, args)
	} catch (err) {
		error(err)
		throw err
	}
}
