/**
 * @typedef {import('./types/FormatResolver.js').default} FormatResolver
 * @typedef {import('./types/TextResolver.js').default} TextResolver
 * @typedef {import('./index.js').Context} Context
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
 * @typedef {"DATA" | "FILTER" | "HEADER" | "SPECIAL" | "DATA-BLOCK"} DimensionType
 */

/**
 * @typedef {"DATA" | "FILTER" | "HEADER" | "SPECIAL"} ResolvedDimensionType
 */

/**
 * @typedef {"DATA" | "FILTER" | "ANY" | "HEADER" | "SPECIAL"} DimensionTypeSelector
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
 * @typedef {"BEGIN" | "END" | null} Pinned
 */

/**
 * @typedef Rect
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef Position
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef FixedSize
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 */

/**
 * @typedef TotalSize
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef ElementPlacement
 * @property {number} [left]
 * @property {number} [top]
 * @property {number} [right]
 * @property {number} [bottom]
 * @property {number} width
 * @property {number} height
 * @property {number} [marginLeft]
 * @property {number} [marginTop]
 * @property {string} section
 */

/**
 * @typedef Dimension
 * @property {Id} [id]
 * @property {DimensionType} [type]
 */

/**
 * @typedef {Dimension} Column
 */

/**
 * @typedef {Dimension} Row
 */

/**
 * @typedef ResolvedDimension
 * @property {Id} id
 * @property {ResolvedDimensionType} type
 * @property {Key} key
 * @property {number} index
 * @property {Label[]} labels
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
 * @property {number} leftWithBorder
 * @property {number} left
 * @property {number} right
 * @property {number} rightWithBorder
 * @property {Pinned} pinned
 */

/**
 * @typedef {ResolvedColumn & ColumnPlacement} PlacedColumn
 */

/**
 * @typedef RowPlacement
 * @property {number} height
 * @property {number} topWithBorder
 * @property {number} top
 * @property {number} bottom
 * @property {number} bottomWithBorder
 * @property {Pinned} pinned
 */

/**
 * @typedef {ResolvedRow & RowPlacement} PlacedRow
 */

/**
 * @typedef {Map<Key, PlacedColumn>} ColumnLookup
 */

/**
 * @typedef {Map<Key, PlacedRow>} RowLookup
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
 * @property {boolean} [autoCommit]
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
 * @property {RuleSelector | RuleSelector[]} [column]
 * @property {RuleSelector | RuleSelector[]} [row]
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
 * @typedef CellId
 * @property {Id} rowId
 * @property {Id} columnId
 */

/**
 * @typedef SortBy
 * @property {Id} [columnId]
 * @property {Id} [rowId]
 * @property {'ASC' | 'DESC' | undefined} [direction]
 */

/**
 * @typedef ResolvedSortBy
 * @property {Id} columnId
 * @property {Id} rowId
 * @property {'ASC' | 'DESC' | undefined} direction
 */

/**
 * @typedef Filter
 * @property {Id} [columnId]
 * @property {Id} [rowId]
 * @property {Value} expression
 */

/**
 * @typedef ResolvedFilter
 * @property {Id} columnId
 * @property {Id} rowId
 * @property {Value} expression
 */

/**
 * @typedef FilteringRule
 * @property {RuleSelector | RuleSelector[]} [column]
 * @property {RuleSelector | RuleSelector[]} [row]
 * @property {Id} by
 */

/**
 * @typedef SortingRule
 * @property {RuleSelector | RuleSelector[]} [column]
 * @property {RuleSelector | RuleSelector[]} [row]
 * @property {Id} by
 */

/**
 * @callback DataSelector
 * @param {FunctionContext} context
 * @returns {Value}
 */

/**
 * @typedef EditedCell
 * @property {Id} columnId
 * @property {Id} rowId
 * @property {Value} value
 */

/**
 * @typedef ColumnWidth
 * @property {Id} columnId
 * @property {number} width
 */

/**
 * @typedef RowHeight
 * @property {Id} rowId
 * @property {number} height
 */

/**
 * @callback FocusedCellChangeFunction
 * @param {CellId} cell
 */

/**
 * @callback SelectedCellsChangeFunction
 * @param {CellId[]} cells
 */

/**
 * @callback EditedCellsChangeFunction
 * @param {EditedCell[]} cells
 */

/**
 * @callback FilterChangeFunction
 * @param {Filter[]} filters
 */

/**
 * @callback SortByChangeFunction
 * @param {SortBy[]} sortBy
 */

/**
 * @callback CellClickFunction
 */

/**
 * @callback ColumnWidthChangeFunction
 * @param {ColumnWidth[]} columnWidths
 */

/**
 * @callback RowHeightChangeFunction
 * @param {RowHeight[]} rowHeights
 */

/**
 * @callback ColumnsOrderChangeFunction
 * @param {Id[]} columnsOrder
 */

/**
 * @callback RowsOrderChangeFunction
 * @param {Id[]} rowsOrder
 */

/**
 * @callback ActiveColumnsChangeFunction
 * @param {Id[]} activeColumns
 */

/**
 * @callback ActiveRowsChangeFunction
 * @param {Id[]} activeRows
 */

/**
 * @callback HoveredCellChangeFunction
 * @param {CellId} cell
 */

/**
 * @callback StateChangeFunction
 * @param {State} state
 */

/**
 * @typedef Options
 * @property {*} data
 * @property {Column[]} columns
 * @property {Row[]} rows
 * @property {number} borderWidth
 * @property {CellId[]} selectedCells
 * @property {SelectedCellsChangeFunction} onSelectedCellsChange
 * @property {SortBy[]} sortBy
 * @property {SortByChangeFunction} onSortByChange
 * @property {Filter[]} filters
 * @property {FilterChangeFunction} onFiltersChange
 * @property {Rule[]} formatting
 * @property {FilteringRule[]} filtering
 * @property {SortingRule[] | "manual"} sorting
 * @property {DataSelector} dataSelector
 * @property {EditedCell[]} editedCells
 * @property {EditedCellsChangeFunction} onEditedCellsChange
 * @property {number} pinnedLeft
 * @property {number} pinnedRight
 * @property {number} pinnedTop
 * @property {number} pinnedBottom
 * @property {CellId} focusedCell
 * @property {FocusedCellChangeFunction} onFocusedCellChange
 * @property {CellId[]} highlightedCells
 * @property {CellClickFunction} onCellClick
 * @property {CellClickFunction} onCustomCellClick
 * @property {ColumnWidth[]} columnWidths
 * @property {ColumnWidthChangeFunction} onColumnWidthsChange
 * @property {RowHeight[]} rowHeights
 * @property {RowHeightChangeFunction} onRowHeightsChange
 * @property {Id[]} columnsOrder
 * @property {ColumnsOrderChangeFunction} onColumnsOrderChange
 * @property {Id[]} rowsOrder
 * @property {RowsOrderChangeFunction} onRowsOrderChange
 * @property {ActiveColumnsChangeFunction} onActiveColumnsChange
 * @property {ActiveRowsChangeFunction} onActiveRowsChange
 * @property {HoveredCellChangeFunction} onHoveredCellChange
 * @property {StateChangeFunction} onStateChange
 */

/**
 * @typedef ExternalOptions
 * @property {*} [data]
 * @property {Column[]} [columns]
 * @property {Row[]} [rows]
 * @property {number} [borderWidth]
 * @property {CellId[]} [selectedCells]
 * @property {SelectedCellsChangeFunction} [onSelectedCellsChange]
 * @property {SortBy[]} [sortBy]
 * @property {SortByChangeFunction} [onSortByChange]
 * @property {Filter[]} [filters]
 * @property {FilterChangeFunction} [onFiltersChange]
 * @property {Rule[]} [formatting]
 * @property {FilteringRule[]} [filtering]
 * @property {SortingRule[] | "manual"} [sorting]
 * @property {DataSelector} [dataSelector]
 * @property {EditedCell[]} [editedCells]
 * @property {EditedCellsChangeFunction} [onEditedCellsChange]
 * @property {number} [pinnedLeft]
 * @property {number} [pinnedRight]
 * @property {number} [pinnedTop]
 * @property {number} [pinnedBottom]
 * @property {CellId} [focusedCell]
 * @property {FocusedCellChangeFunction} [onFocusedCellChange]
 * @property {CellId[]} [highlightedCells]
 * @property {CellClickFunction} [onCellClick]
 * @property {CellClickFunction} [onCustomCellClick]
 * @property {ColumnWidth[]} [columnWidths]
 * @property {ColumnWidthChangeFunction} [onColumnWidthsChange]
 * @property {RowHeight[]} [rowHeights]
 * @property {RowHeightChangeFunction} [onRowHeightsChange]
 * @property {Id[]} [columnsOrder]
 * @property {ColumnsOrderChangeFunction} [onColumnsOrderChange]
 * @property {Id[]} [rowsOrder]
 * @property {RowsOrderChangeFunction} [onRowsOrderChange]
 * @property {ActiveColumnsChangeFunction} [onActiveColumnsChange]
 * @property {ActiveRowsChangeFunction} [onActiveRowsChange]
 * @property {HoveredCellChangeFunction} [onHoveredCellChange]
 * @property {StateChangeFunction} [onStateChange]
 */

/**
 * @typedef State
 * @property {FormatResolver} renderFormatResolver
 * @property {FormatResolver} inputFormatResolver
 * @property {Sections} sections
 * @property {Rect} scrollRect
 * @property {TextResolver} textResolver
 * @property {number} borderWidth
 * @property {ElementPlacement} inputPlacement
 * @property {boolean} isTextValid
 * @property {Id} resizableColumn
 * @property {Id} resizableRow
 * @property {Options} options
 * @property {ColumnLookup} columnLookup
 * @property {RowLookup} rowLookup
 * @property {string} text
 * @property {FixedSize} fixedSize
 * @property {TotalSize} totalSize
 */

/**
 * @callback RequestNewRenderFunction
 */