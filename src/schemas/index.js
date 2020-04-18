const Joi = require('@hapi/joi')

/** The naming pattern for Xstyle theme names. */
const themeNamePattern = /[\w-]+/

/** Validation schema for a color name. Can either be a:
 * <ul>
 *   <li>CSS color name</li>
 *   <li>Theme color name</li>
 *   <li>Hexadecimal color</li>
 *   <li>RGBA color</li>
 * </ul>
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

/** Schema for a font-weight CSS property, allowing for arbitrary strings to support theme props */
const fontWeightSchema = Joi.alternatives().try(Joi.string(), Joi.number().min(100).max(900))

/** Schema for a line-height CSS property, allowing for arbitrary strings to support theme props */
const lineHeightSchema = Joi.alternatives().try(Joi.string(), Joi.number())

/** Schema for a font-family CSS property, allowing for arbitrary strings to support theme props */
const fontFamilySchema = Joi.string()

/** Schema for a letter-spacing CSS property, allowing for arbitrary strings to support theme props */
const letterSpacingSchema = Joi.string()

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

const typographyFileSchema = Joi.object().keys({
	fontSizes: Joi.object().pattern(themeNamePattern, fontSizeSchema),
	fontWeights: Joi.object().pattern(themeNamePattern, fontWeightSchema),
	fonts: Joi.object().pattern(themeNamePattern, fontFamilySchema),
	letterSpacings: Joi.object().pattern(themeNamePattern, letterSpacingSchema),
	lineHeights: Joi.object().pattern(themeNamePattern, lineHeightSchema),
	textStyles: Joi.object().pattern(
		themeNamePattern,
		Joi.object({
			fontSize: fontSizeSchema,
			fontWeight: fontWeightSchema,
			fontFamily: fontFamilySchema,
			letterSpacing: letterSpacingSchema,
			lineHeight: lineHeightSchema,
			color: foregroundColorSchema,
		})
	),
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
	fontFamilySchema,
	letterSpacingSchema,
	colorFileSchema,
	typographyFileSchema,
}
