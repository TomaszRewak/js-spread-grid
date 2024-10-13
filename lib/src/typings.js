/**
 * @typedef {import('./types/FormatResolver.js').default} FormatResolver
 * @typedef {import('./types/TextResolver.js').default} TextResolver
 */

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
 * @typedef {string} Color
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

/**
 * @typedef {"top" | "middle" | "bottom"} TextBaseline
 */

/**
 * @typedef {"left" | "center" | "right" } HorizontalSectionName
 */

/**
 * @typedef {"top" | "middle" | "bottom"} VerticalSectionName
 */

/**
 * @typedef Rect
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef ElementPlacement
 * @property {number} left
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} width
 * @property {number} height
 * @property {string} section
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
 * @typedef ColumnPlacement
 * @property {number} width
 */

/**
 * @typedef {ResolvedColumn & ColumnPlacement} PlacedColumn
 */

/**
 * @typedef RowPlacement
 * @property {number} height
 */

/** 
 * @typedef {ResolvedRow & RowPlacement} PlacedRow
 */

/**
 * @typedef {*} Data
 */

/**
 * @typedef Border
 * @property {number} width
 * @property {Color} [color]
 * @property {number[]} [dash]
 * @property {number} [index]
 */

/**
 * @typedef Style
 * @property {HorizontalAlignment} [textAlign]
 * @property {TextBaseline} [textBaseline]
 * @property {Color} [foreground]
 * @property {Color} [background]
 * @property {Color} [highlight]
 * @property {Color} [corner]
 * @property {Border} [borderTop]
 * @property {Border} [borderRight]
 * @property {Border} [borderBottom]
 * @property {Border} [borderLeft]
 */

/**
 * @callback InternalDrawFunction
 * @param {CanvasRenderingContext2D} ctx
 * @returns {void}
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
 * @typedef Cell
 * @property {Value} [value]
 * @property {Style} style
 * @property {string} text
 * @property {Padding} padding
 * @property {string} font
 * @property {Edit} [edit]
 * @property {string} [tooltip]
 * @property {InternalDrawFunction} [draw]
 */

/**
 * @typedef Padding
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} left
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
 * @property {Value} [newValue]
 * @property {string} [text]
 * @property {ResolvedRow} row
 * @property {ResolvedColumn} column
 * @property {ResolvedRow[]} rows
 * @property {ResolvedColumn[]} columns
 * @property {Edit} [edit]
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

/**
 * @typedef HorizontalSection
 * @property {PlacedColumn[]} columns
 * @property {number} width
 * @property {boolean} showLeftBorder
 * @property {boolean} showRightBorder
 */

/**
 * @typedef VerticalSection
 * @property {PlacedRow[]} rows
 * @property {number} height
 * @property {boolean} showTopBorder
 * @property {boolean} showBottomBorder
 */

/**
 * @typedef Sections
 * @property {HorizontalSection} left
 * @property {HorizontalSection} center
 * @property {HorizontalSection} right
 * @property {VerticalSection} top
 * @property {VerticalSection} middle
 * @property {VerticalSection} bottom
 */

/**
 * @typedef State
 * @property {FormatResolver} renderFormatResolver
 * @property {Sections} sections
 * @property {Rect} scrollRect
 * @property {TextResolver} textResolver
 * @property {number} borderWidth
 * @property {ElementPlacement} inputPlacement
 * @property {boolean} isTextValid
 * @property {Id} resizableColumn
 * @property {Id} resizableRow
 */

/**
 * @typedef Context
 * @property {State} state
 * @property {HTMLElement} element
 * @property {Object.<string, HTMLCanvasElement>} canvases
 * @property {HTMLInputElement} input
 * @property {boolean} isReordering
 * @property {boolean} errorRendered
 * @property {Error} [error]
 */