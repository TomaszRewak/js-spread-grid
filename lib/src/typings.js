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
 * @typedef {"DATA" | "FILTER" | "ANY"} DimensionTypeSelector
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
 * @typedef Border
 * @property {number} width
 */

/**
 * @typedef Style
 * @property {HorizontalAlignment} [textAlign]
 * @property {string} [color]
 * @property {string} [background]
 * @property {Border} [borderTop]
 * @property {Border} [borderRight]
 * @property {Border} [borderBottom]
 * @property {Border} [borderLeft]
 */

/**
 * @typedef Cell
 * @property {Value} [value]
 * @property {Style} style
 */

/**
 * @typedef Padding
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} left
 */

/**
 * @typedef ValidateContext
 * @property {string} string
 */

/**
 * @callback ValidateFunction
 * @param {ValidateContext} context
 * @returns {boolean}
 */

/**
 * @typedef ParseContext
 * @property {string} string
 */

/**
 * @callback ParseFunction
 * @param {ParseContext} context
 * @returns {Value}
 */

/**
 * @typedef Edit
 * @property {ValidateFunction} validate
 * @property {ParseFunction} parse
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
 * @property {DimensionTypeSelector} type
 */

/**
 * @typedef {RuleIdSelector | RuleLabelSelector | RuleTypeSelector} RuleSelector
 */

/**
 * @typedef FunctionContext
 * @property {Data} data
 * @property {Value} [value]
 * @property {string} [text]
 * @property {ResolvedRow} row
 * @property {ResolvedColumn} column
 */

/**
 * @typedef DrawContext
 * @property {Data} data
 * @property {Value} [value]
 * @property {string} [text]
 * @property {ResolvedRow} row
 * @property {ResolvedColumn} column
 * @property {CanvasRenderingContext2D} ctx
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
 * @callback FontFunction
 * @param {FunctionContext} context
 * @returns {string}
 */

/**
 * @callback PaddingFunction
 * @param {FunctionContext} context
 * @returns {Padding}
 */

/**
 * @callback TooltipFunction
 * @param {FunctionContext} context
 * @returns {string}
 */

/**
 * @callback DrawFunction
 * @param {DrawContext} context
 * @returns {void}
 */

/**
 * @callback InternalDrawFunction
 * @param {CanvasRenderingContext2D} ctx
 * @returns {void}
 */

/**
 * @typedef Rule
 * @property {RuleSelector | RuleSelector[]} column
 * @property {RuleSelector | RuleSelector[]} row
 * @property {ConditionFunction} [condition]
 * @property {Value | ValueFunction} [value]
 * @property {Style | StyleFunction} [style]
 * @property {string | TextFunction} [text]
 * @property {string | FontFunction} [font]
 * @property {Padding | PaddingFunction} [padding]
 * @property {Edit} [edit]
 * @property {string | TooltipFunction} [tooltip]
 * @property {DrawFunction} [draw]
 */

/**
 * @typedef FormattingRule
 * @property {number} index
 * @property {ConditionFunction} [condition]
 * @property {ValueFunction} [value]
 * @property {StyleFunction} [style]
 * @property {TextFunction} [text]
 * @property {FontFunction} [font]
 * @property {PaddingFunction} [padding]
 * @property {Edit} [edit]
 * @property {TooltipFunction} [tooltip]
 * @property {DrawFunction} [draw]
 */