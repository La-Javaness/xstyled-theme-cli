require('source-map-support/register')
const chalk = require('chalk')
const minimist = require('minimist')

const { COMMANDS } = require('./constants')
const { error } = require('./logger')
const cliName = require('./utils/cliName')
const nearestCommand = require('./utils/nearestCommand')

const resolveCmd = async (cmd, args) => {
	try {
		require(`./commands/${cmd}`)(args)
	} catch (e) {
		error(e)
	}
}

module.exports = () => {
	const args = minimist(process.argv.slice(2))
	let cmd = args._[0] || 'help'

	if (!COMMANDS.includes(cmd)) {
		error(
			chalk`'${cliName} ${cmd}' is not a valid command, did you mean...

{reset $ {cyanBright ${cliName}} {magentaBright ${nearestCommand(cmd)}} }
			`
		)
	}
	return resolveCmd(cmd, args)
}
