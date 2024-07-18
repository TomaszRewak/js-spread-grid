/**
 * @typedef {*} Id
 */

/**
 * @typedef {string} Key
 */

/**
 * @typedef {*} Value
 */

/**
 * @typedef {string} Label
 */

/**
 * @typedef {"DATA" | "FILTER"} DimensionType
 */

/**
 * @typedef {"left" | "center" | "right"} HorizontalAlignment
 */

// TODO: Don't use Object
/**
 * @typedef {Object} Dimension
 */

/**
 * @typedef {Dimension} Column
 */

/**
 * @typedef {Dimension} Row
 */

/**
 * @typedef ResolvedDimension
 * @property {Key} key
 * @property {number} index
 * @property {Label[]} labels
 * @property {DimensionType} type
 * @property {*} [metadata]
 */

/**
 * @typedef {ResolvedDimension} ResolvedColumn
 */

/**
 * @typedef {ResolvedDimension} ResolvedRow
 */

/**
 * @typedef {*} Data
 */

/**
 * @typedef Style
 * @property {HorizontalAlignment} [textAlign]
 */

/**
 * @typedef Cell
 * @property {Value} [value]
 * @property {Style} style
 */

/**
 * @typedef RuleIdSelector
 * @property {Id} id
 */

/**
 * @typedef RuleLabelSelector
 * @property {Label} label
 */

/**
 * @typedef RuleTypeSelector
 * @property {DimensionType} type
 */

/**
 * @typedef {RuleIdSelector | RuleLabelSelector | RuleTypeSelector} RuleSelector
 */

/**
 * @typedef FunctionContext
 * @property {Data} data
 * @property {Value} [value]
 * @property {string} [text]
 */

/**
 * @callback ConditionFunction
 * @param {FunctionContext} context
 * @returns {boolean}
 */

/**
 * @callback ValueFunction
 * @param {FunctionContext} context
 * @returns {Value}
 */

/**
 * @callback StyleFunction
 * @param {FunctionContext} context
 * @returns {Style}
 */

/**
 * @callback TextFunction
 * @param {FunctionContext} context
 * @returns {string}
 */

/**
 * @typedef Rule
 * @property {RuleSelector | RuleSelector[]} column
 * @property {RuleSelector | RuleSelector[]} row
 * @property {ConditionFunction} [condition]
 * @property {Value | ValueFunction} [value]
 * @property {Style | StyleFunction} [style]
 * @property {string | TextFunction} [text]
 */

/**
 * @typedef FormattingRule
 * @property {number} index
 * @property {ConditionFunction} [condition]
 * @property {ValueFunction} [value]
 * @property {StyleFunction} [style]
 * @property {TextFunction} [text]
 */