const chalk = require('chalk')
const Joi = require('@hapi/joi')

/** The naming pattern for Xstyle theme names. */
const themeNamePattern = /[\w-]+/

/** Validation schema for a color name. Can either be a:
 * <ul>
 * <li>CSS color name</li>
 * <li>Theme color name</li>
 * <li>Hexadecimal color</li>
 * <li>RGBA color</li>
 * </ul>.
 */
const colorSchema = Joi.string() // TODO restrict further

/** Validation schema for a background color name. Must be an alphabetic string. */
const backgroundColorSchema = Joi.string() // TODO restrict further

/** The naming pattern for references to background color names. */
const backgroundColorRefPattern = /on-[\w-]+/

/**
 * Validation schema for a foreground color data structure.
 * Colors can either be a color name, or an object where keys are background
 * color names and values are the names of the color to use for that background.
 */
const foregroundColorSchema = Joi.alternatives().try(
	colorSchema,
	Joi.object()
		.keys({
			default: colorSchema,
		})
		.pattern(backgroundColorRefPattern, colorSchema)
)

/** Schema for a font-size CSS property, allowing for arbitrary strings to support theme props. */
const fontSizeSchema = Joi.alternatives().try(Joi.string(), Joi.number().positive())

/** Schema for a font-weight CSS property, allowing for arbitrary strings to support theme props. */
const fontWeightSchema = Joi.alternatives().try(Joi.string(), Joi.number().min(100).max(900))

/** Schema for a line-height CSS property, allowing for arbitrary strings to support theme props. */
const lineHeightSchema = Joi.alternatives().try(Joi.string(), Joi.number())

/** Schema for a text-decoration CSS property, allowing for arbitrary strings to support theme props. */
const textDecorationSchema = Joi.string()

/** Schema for a text-transform CSS property, allowing for arbitrary strings to support theme props. */
const textTransformSchema = Joi.string()

/** Schema for a font-family CSS property, allowing for arbitrary strings to support theme props. */
const fontFamilySchema = Joi.string()

/** Schema for a letter-spacing CSS property, allowing for arbitrary strings to support theme props. */
const letterSpacingSchema = Joi.string()

/** Schema for the name of a variant in a component. */
const variantNameSchema = Joi.string().regex(themeNamePattern)

/**
 * Validation schema for the JSON representation of a `colors.yml` file's content.
 * Three sections exist: colors, backgrounds and foregrounds. The former two match
 * color name keys to colors, and the latter color name keys to foreground colors.
 */
const colorFileSchema = Joi.object().keys({
	colors: Joi.object().pattern(themeNamePattern, colorSchema),
	backgrounds: Joi.object().pattern(themeNamePattern, colorSchema),
	foregrounds: Joi.object().pattern(themeNamePattern, foregroundColorSchema),
})

/**
 * Builds a validation schema that always fails, and prints an error message
 * inviting the user to use another key instead. Convenient for when you
 * deprecated a key in an API or when users often make the same typo.
 * @param  {string} alt The correct spelling for the erroneous key that uses
 * this validation schema.
 * @returns {object} A Joi validation schema, expected to be used only on an
 * object key.
 */
const altPropertyName = (alt) =>
	Joi.any()
		.forbidden()
		.error((errors) => {
			const badKey = errors[0].path.pop()
			const badPath = `${errors[0].path.join('.')}.${chalk.bgWhiteBright.red(badKey)}`
			const goodPath = `${errors[0].path.join('.')}.${chalk.bgWhiteBright.blue(alt)}`

			const customErr = new Error(`"${badPath}" should be typed "${goodPath}" instead`)
			customErr.name = ''

			return customErr
		})

/**
 * Validation schema for the JSON representation of a `typography.yml` file's content.
 * Defines possible values for font-related CSS properties, and a textStyles section
 * that maps text style names to specific values of the font-related properties.
 */
const typographyFileSchema = Joi.object().keys({
	fontSizes: Joi.object().pattern(themeNamePattern, fontSizeSchema),
	fontWeights: Joi.object().pattern(themeNamePattern, fontWeightSchema),
	fonts: Joi.object().pattern(themeNamePattern, fontFamilySchema),
	letterSpacings: Joi.object().pattern(themeNamePattern, letterSpacingSchema),
	lineHeights: Joi.object().pattern(themeNamePattern, lineHeightSchema),
	textDecorations: Joi.object().pattern(themeNamePattern, textDecorationSchema),
	textTransforms: Joi.object().pattern(themeNamePattern, textTransformSchema),
	textStyles: Joi.object().pattern(
		themeNamePattern,
		Joi.object({
			// Singular property names are allowed
			fontSize: fontSizeSchema,
			fontWeight: fontWeightSchema,
			fontFamily: fontFamilySchema,
			letterSpacing: letterSpacingSchema,
			lineHeight: lineHeightSchema,
			textDecoration: textDecorationSchema,
			textTransform: textTransformSchema,
			color: foregroundColorSchema,
			// Plurals refer to the theme properties and NOT to text style properties
			fontSizes: altPropertyName('fontSize'),
			fontWeights: altPropertyName('fontWeight'),
			fonts: altPropertyName('font'),
			letterSpacings: altPropertyName('letterSpacing'),
			lineHeights: altPropertyName('lineHeight'),
			textDecorations: altPropertyName('textDecoration'),
			textTransforms: altPropertyName('textTransform'),
			colors: altPropertyName('color'),
		})
	),
})

/**
 * Validation schema for the JSON representation of a component file.
 * Defines variants for the component, as well as CSS instructions to apply for
 * each variant.
 */
const componentFileSchema = Joi.object().keys({
	core: Joi.object(), // TODO FIXME improve
	variants: Joi.object()
		.keys({
			default: variantNameSchema,
		})
		.pattern(themeNamePattern, Joi.object()),
	sizes: Joi.object() // TODO FIXME generalise to *s
		.keys({
			default: variantNameSchema,
		})
		.pattern(themeNamePattern, Joi.object()),
})

module.exports = {
	themeNamePattern,
	colorSchema,
	backgroundColorSchema,
	backgroundColorRefPattern,
	foregroundColorSchema,
	fontSizeSchema,
	fontWeightSchema,
	lineHeightSchema,
	textDecorationSchema,
	textTransformSchema,
	fontFamilySchema,
	letterSpacingSchema,
	colorFileSchema,
	typographyFileSchema,
	componentFileSchema,
}
