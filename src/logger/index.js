const chalk = require('chalk')

let _insideStep = false

const pad = (messageLen, targetLen, char = ' ') => new Array(Math.max(0, targetLen - messageLen)).join(char)

/**
 * Formats a message with chalk, using preset decoration modes.
 * @param  {String} mode    Decoration mode (one of 'header', 'section'. 'bold', 'dim', 'warning', 'success')
 * @param  {String} message The message to print.
 * @return {String} the same message, decorated accordingly
 */
const chalkFormat = (mode, message) => {
	switch (mode) {
		case 'header':
			return chalk.bgWhiteBright.blackBright(`\n -  ${message}${pad(message.length + 8, 72)}  - \n`)
		case 'section':
			return chalk.bold.inverse(message)
		case 'bold':
			return chalk.bold(message)
		case 'dim':
			return chalk.dim(message)
		case 'warning':
			return chalk.bgYellowBright.black(message)
		case 'success':
			return chalk.bgGreenBright.black(message)
		default:
			return message
	}
}

/**
 * Prints a message with decoration using `chalkFormat`
 * @param  {String} mode    Decoration mode (one of 'header', 'section'. 'bold', 'dim', 'warning', 'success')
 * @param  {String} message The message to print.
 * @return {void}
 */
const log = (mode, message) => {
	process.stdout.write(chalkFormat(mode, message))
}

/**
 * Prints a message without end of line. To be used with `end`, at the beginning of
 * a step of computation notified to the user of the CLI.
 * @param  {String} message The message explaining the step about to be performed.
 * @return {void}
 */
const start = (message) => {
	process.stdout.write(`${message}...`)
	_insideStep = {
		len: message.length + 3,
	}
}

/**
 * Prints a validation for a message started with `start`. Also prints an end of line.
 * @param  {?Boolean} [success=true] If true, shows a success indicator, else a failure indicator.
 * @return {void}
 */
const end = (success = true) => {
	let padding = ''

	if (_insideStep) {
		padding = pad(_insideStep.len, 69)
		_insideStep = false
	}

	process.stdout.write(`${padding}${success ? chalk.bgGreenBright.black(' ✓ ') : chalk.bgRed.white.bold(' ✗ ')}\n`)
}

/**
 * Prints an error message to stderr, and potentially exits.
 * @param  {String} message The message to print
 * @param  {?Number|Boolean} [exitCode=1] If set to anything but false, the exit code with which to exit the CLI
 * @return {void}
 */
const error = (message, exitCode = 1) => {
	if (_insideStep) {
		end(false)
	}
	process.stderr.write(chalk.bgRed.white.bold(message))
	process.stderr.write('\n')
	exitCode !== false && process.exit(exitCode)
}

module.exports = {
	chalkFormat,
	log,
	end,
	error,
	step: {
		start,
		end,
	},
}
