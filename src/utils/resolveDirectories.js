const path = require('path')

/**
 * Root directory for commands run from inside a theme, e.g. `build`.
 * @type {string}
 */
const THEME_ROOT = './' // TODO DEBUG THIS // FIXME

/**
 * Root directory for commands run from inside a project, e.g. `search` or `install`.
 * @type {string}
 */
const PROJECT_ROOT = './' // TODO DEBUG THIS // FIXME

module.exports = (args, inProject = true) => {
	const rootDir = args.root || args.r || inProject ? PROJECT_ROOT : THEME_ROOT
	const rootPath = path.resolve(rootDir) // TODO DEBUG THIS // FIXME

	/* Input directories for the theme */
	const THEME_ASSETS_DIRNAME = 'assets'
	const THEME_FONTS_DIRNAME = 'fonts'
	const THEME_ICONS_DIRNAME = 'icons'
	const THEME_IMAGES_DIRNAME = 'images'
	const THEME_SRC_DIRNAME = 'src'
	const themeAssetsPath = args['assets-dir'] || path.join(rootPath, THEME_ASSETS_DIRNAME)
	const themeFontsPath = args['fonts-dir'] || path.join(themeAssetsPath, THEME_FONTS_DIRNAME)
	const themeIconsPath = args['icons-dir'] || path.join(themeAssetsPath, THEME_ICONS_DIRNAME)
	const themeImagesPath = args['images-dir'] || path.join(themeAssetsPath, THEME_IMAGES_DIRNAME)
	const themeSrcPath = args['src-dir'] || path.join(rootPath, THEME_SRC_DIRNAME)

	/* Output directories for the theme */
	const THEME_OUTPUT_DIRNAME = 'dist'
	const themeOutputPath = args.output || path.join(rootPath, THEME_OUTPUT_DIRNAME)

	/* Public path used on the server of a built project */
	const PUBLIC_PATH = '/public'
	const publicPath = args['production-public-path'] || PUBLIC_PATH
	const publicFontsPath = args['production-public-fonts-path'] || path.join(publicPath, 'fonts')

	return {
		rootDir,
		rootPath,

		themeAssetsPath,
		themeFontsPath,
		themeIconsPath,
		themeImagesPath,
		themeSrcPath,

		themeOutputPath,

		publicPath,
		publicFontsPath,
	}
}
