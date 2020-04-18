const { log } = require('../logger')
const { name, version } = require('../../package.json')

module.exports = () => {
	log('', `${name}, version ${version}\n`)
}
