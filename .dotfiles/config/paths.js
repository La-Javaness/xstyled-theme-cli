'use strict'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const moduleFileExtensions = [
	'web.mjs',
	'mjs',
	'web.js',
	'js',
	'web.ts',
	'ts',
	'web.tsx',
	'tsx',
	'json',
	'web.jsx',
	'jsx',
]

const resolveModule = (resolveFn, filePath) => {
	const extension = moduleFileExtensions.find((extension) => fs.existsSync(resolveFn(`${filePath}.${extension}`)))

	if (extension) {
		return resolveFn(`${filePath}.${extension}`)
	}

	return resolveFn(`${filePath}.js`)
}

module.exports = {
	dotenv: resolveApp('.env'),
	appPath: resolveApp('.'),
	appBuild: resolveApp('build'),
	appPublic: resolveApp('public'),
	appHtml: resolveApp('public/index.html'),
	appIndexJs: resolveModule(resolveApp, 'src/index'),
	appPackageJson: resolveApp('package.json'),
	appSrc: resolveApp('src'),
	appTsConfig: resolveApp('tsconfig.json'),
	appJsConfig: resolveApp('jsconfig.json'),
	yarnLockFile: resolveApp('yarn.lock'),
	proxySetup: resolveApp('src/setupProxy.js'),
	appNodeModules: resolveApp('node_modules'),
}

module.exports.moduleFileExtensions = moduleFileExtensions
