const { transformFileSync } = require('@babel/core')

const { step } = require('../logger')
const getJSFilePaths = require('../utils/getJSFilePaths')
const writeFile = require('../utils/writeFile')

const transpileJS = async (dirs) => {
	step.start('Transpiling JavaScript source files')

	const filesWithJS = await getJSFilePaths(dirs, false)
	const transOpts = {
		sourceType: 'module',
		presets: ['@babel/preset-env', '@babel/preset-react'],
		plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-transform-runtime'],
	}

	filesWithJS
		.map((filepath) => [filepath, transformFileSync(filepath, transOpts)])
		.map(([filepath, transpiledCode]) => writeFile(transpiledCode.code, filepath, { overwrite: true }))

	step.end()
}

module.exports = {
	transpileJS,
}
