'use strict'

const fs = require('fs')
const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'production'

const dotenvFiles = [
	`.env.${NODE_ENV}.local`,
	`.env.${NODE_ENV}`,
	NODE_ENV !== 'test' && `.env.local`,
	'.env',
].filter(Boolean)

dotenvFiles.forEach((dotenvFile) => {
	if (fs.existsSync(dotenvFile)) {
		require('dotenv-expand')(
			require('dotenv').config({
				path: dotenvFile,
			})
		)
	}
})

module.exports = {}
