
## General
* Split package into the actual theme and a CLI package
* [WIP] Write YML format validators with a DSL
* Optimise font output by writing a `styled-components-loader` that turns the CSS file into a CSS-in-JS `createGlobalStyle`-based JS file
* Write documentation for theme format
* GENERATE THE THEME.JS OUTPUT FILE

## Fonts
* Add script to handle font assets
* Ensure CSS file is generated and usable

## Color
* adjust TS definition to provide a whole list of color literals?
* gen JS variables for integration with other tools? or a JS util in front-comp?
* Add a resolveBackgroundColor util

## Icons
* Compatibility:
  * Add build methods that are compatible with legacy browsers
  * Port Icon component to use feature detection and use the best implementation
* In front-components, generate a StoryBook story for each icon for regression testing, and a all-icons story that can be included in the doc
* Document how to add icons and use the plugin / CLI
* Document browser support and known limitations for both icons
