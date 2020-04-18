require('source-map-support/register')
const minimist = require('minimist')

const { COMMANDS } = require('./constants')
const { error } = require('./logger')

const resolveCmd = async (cmd, args) => {
	try {
		require(`./commands/${cmd}`)(args)
	} catch (e) {
		if (e.code !== 'MODULE_NOT_FOUND' || !!process.env.XSTYLED_THEME_DEBUG) {
			error(e)
		} else {
			error(`=== "${cmd}" is not a valid command`)
		}
	}
}

module.exports = () => {
	const args = minimist(process.argv.slice(2))
	let cmd = args._[0] || 'help'

	return COMMANDS.includes(cmd)
		? resolveCmd(cmd, args)
		: error(
				`=== "${cmd}" is not a valid command, try one of the following:\n${COMMANDS.map(
					(cmd) => `\t${cmd}\n`
				).join('')}`,
				true
		  )
}
