const chalk = require('chalk')

const { log } = require('../logger')
const cliName = require('../utils/cliName')

const { version } = require('../../package.json')

module.exports = () => {
	log('', chalk`{bold {cyanBright ${cliName}} {blueBright.bgBlack ${version}}}\n`)
}
