/**
 * @typedef {import('./types/FormatResolver.js').default} FormatResolver
 * @typedef {import('./types/TextResolver.js').default} TextResolver
 * @typedef {import('./types/Edition.js').default} Edition
 * @typedef {import('./types/FilteringRules.js').default} FilteringRules
 * @typedef {import('./types/FormattingRules.js').default} FormattingRules
 * @typedef {import('./types/SortingRules.js').default} SortingRules
 * @typedef {import('./types/Selection.js').default} Selection_
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
 * @typedef {"DATA" | "FILTER" | "HEADER" | "CUSTOM"} DimensionType
 */

/**
 * @typedef {"DATA" | "FILTER"} EditDimensionType
 */

/**
 * @typedef {"DATA" | "FILTER" | "ANY" | "HEADER" | "CUSTOM" | "SPECIAL"} DimensionTypeSelector
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
 * @typedef {"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right"} SectionName
 */

/**
 * @typedef {"BEGIN" | "END" | null} Pinned
 */

/**
 * @typedef {"fit" | "fit-once" | "fit-data" | "fit-data-once"} FittingType
 */

/**
 * @typedef {"ASC" | "DESC" | undefined} SortDirection
 */

/**
 * @typedef Rect
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef Margin
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} left
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
 * @property {SectionName} section
 */

/**
 * @typedef TooltipPlacement
 * @property {number} top
 * @property {number} left
 */

/**
 * @typedef FontMetrics
 * @property {number} topOffset
 * @property {number} middle
 * @property {number} bottomOffset
 * @property {number} height
 */

/**
 * @typedef Dimension
 * @property {Id} [id]
 * @property {DimensionType} [type]
 * @property {Label[]} [labels]
 * @property {string} [header]
 */

/**
 * @callback DimensionSelectorFunction
 * @param {Data} data
 * @returns {Id[]}
 */

/**
 * @typedef FoldedDimension
 * @property {Id} [id]
 * @property {"DATA-BLOCK"} type
 * @property {Label[]} [labels]
 * @property {DimensionSelectorFunction} [selector]
 */

/**
 * @typedef UnresolvedWidth
 * @property {number | FittingType} [width]
 */

/**
 * @typedef UnresolvedHeight
 * @property {number | FittingType} [height]
 */

/**
 * @typedef {(Dimension | FoldedDimension) & UnresolvedWidth} Column
 */

/**
 * @typedef {(Dimension | FoldedDimension) & UnresolvedHeight} Row
 */

/**
 * @typedef {Dimension & UnresolvedWidth} UnfoldedColumn
 */

/**
 * @typedef {Dimension & UnresolvedHeight} UnfoldedRow
 */

/**
 * @typedef ResolvedDimension
 * @property {Id} id
 * @property {DimensionType} type
 * @property {Key} key
 * @property {number} index
 * @property {Label[]} labels
 * @property {*} [metadata]
 * @property {Pinned} pinned
 * @property {string} [header]
 */

/**
 * @typedef GeneralWidth
 * @property {number | FittingType} width
 */

/**
 * @typedef GeneralHeight
 * @property {number | FittingType} height
 */

/**
 * @typedef {ResolvedDimension & GeneralWidth} ResolvedColumn
 */

/**
 * @typedef {ResolvedDimension & GeneralHeight} ResolvedRow
 */

/**
 * @typedef MeasuredWidth
 * @property {number} width
 */

/**
 * @typedef MeasuredHeight
 * @property {number} height
 */

/**
 * @typedef {ResolvedColumn & MeasuredWidth} MeasuredColumn
 */

/**
 * @typedef {ResolvedRow & MeasuredHeight} MeasuredRow
 */

/**
 * @typedef ColumnPlacement
 * @property {number} leftWithBorder
 * @property {number} left
 * @property {number} right
 * @property {number} rightWithBorder
 * @property {Pinned} pinned
 */

/**
 * @typedef {MeasuredColumn & ColumnPlacement} PlacedColumn
 */

/**
 * @typedef RowPlacement
 * @property {number} topWithBorder
 * @property {number} top
 * @property {number} bottom
 * @property {number} bottomWithBorder
 * @property {Pinned} pinned
 */

/**
 * @typedef {MeasuredRow & RowPlacement} PlacedRow
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
 * @property {Border} [border]
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
 * @typedef ToggleContext
 * @property {Value} value
 */

/**
 * @callback ToggleFunction
 * @param {ToggleContext} context
 * @returns {Value}
 */

/**
 * @typedef Edit
 * @property {ValidateFunction} validate
 * @property {ParseFunction} parse
 * @property {boolean} [autoCommit]
 * @property {ToggleFunction | Value[]} [toggle]
 */

/**
 * @typedef EditableCell
 * @property {Edit} edit
 * @property {CellId} cell
 * @property {EditDimensionType} type
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
 * @typedef RuleKeySelector
 * @property {Key} key
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
 * @typedef {RuleKeySelector | RuleLabelSelector | RuleTypeSelector} ResolvedRuleSelector
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
 * @property {Edit | boolean} [edit]
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
 * @property {Edit | boolean} [edit]
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
 * @typedef CachedWidth
 * @property {number} width
 * @property {boolean} dataOnly
 */

/**
 * @typedef CachedHeight
 * @property {number} height
 * @property {boolean} dataOnly
 */

/**
 * @typedef {Map<Key, CachedWidth>} ColumnWidthCache
 */

/**
 * @typedef {Map<Key, CachedHeight>} RowHeightCache
 */

/**
 * @typedef CellId
 * @property {Id} rowId
 * @property {Id} columnId
 */

/**
 * @typedef OptionalCellId
 * @property {Id} [rowId]
 * @property {Id} [columnId]
 */

/**
 * @typedef SortBy
 * @property {Id} [columnId]
 * @property {Id} [rowId]
 * @property {SortDirection} [direction]
 */

/**
 * @typedef ResolvedSortBy
 * @property {Id} columnId
 * @property {Id} rowId
 * @property {SortDirection} direction
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
 * @typedef FilterContext
 * @property {Data} data
 * @property {ResolvedRow} row
 * @property {ResolvedColumn} column
 * @property {ResolvedRow[]} rows
 * @property {ResolvedColumn[]} columns
 * @property {Value} value
 * @property {string} text
 * @property {Value} expression
 */

/**
 * @callback FilterCondition
 * @param {FilterContext} context
 */

/**
 * @typedef FilteringRule
 * @property {RuleSelector | RuleSelector[]} [column]
 * @property {RuleSelector | RuleSelector[]} [row]
 * @property {Id} by
 * @property {FilterCondition} [condition]
 */

/**
 * @callback SortingComparator
 * @param {Cell} lhs
 * @param {Cell} rhs
 * @returns {boolean}
 */

/**
 * @typedef SortingRule
 * @property {RuleSelector | RuleSelector[]} [column]
 * @property {RuleSelector | RuleSelector[]} [row]
 * @property {Id} by
 * @property {SortingComparator} [comparator]
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
 * @typedef CellClickEvent
 * @property {Id} columnId
 * @property {Id} rowId
 * @property {boolean} ctrlKey
 * @property {boolean} shiftKey
 * @property {number} button
 * @property {number} buttons
 * @property {number} detail
 */

/**
 * @callback CellClickFunction
 * @param {CellClickEvent} event
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
 * @param {string[]} changes
 */

/**
 * @callback ColumnGenerator
 * @param {Data} data
 * @returns {Column[]}
 */

/**
 * @callback RowGenerator
 * @param {Data} data
 * @returns {Row[]}
 */

/**
 * @typedef Options
 * @property {*} data
 * @property {Column[] | ColumnGenerator} columns
 * @property {Row[] | RowGenerator} rows
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
 * @property {PlacedColumn[]} columns
 * @property {PlacedRow[]} rows
 * @property {CellId} hoveredCell
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
 * @property {CellId[]} highlightedCells
 * @property {Edition} edition
 * @property {CellId} focusedCell
 * @property {number} devicePixelRatio
 * @property {string} tooltip
 * @property {TooltipPlacement} tooltipPlacement
 */

/**
 * @template T
 * @typedef Cached
 * @property {T} value
 * @property {Array<*>} [dependencies]
 */

/**
 * @typedef Memory
 * @property {Cached<SortBy[]>} [sortBy]
 * @property {Cached<ResolvedFilter[]>} [filters]
 * @property {Cached<TextResolver>} [textResolver]
 * @property {Cached<Rule[]>} [dataFormatting]
 * @property {Cached<EditedCell[]>} [editedCellsAndFilters]
 * @property {Cached<Edition>} [edition]
 * @property {Cached<Column[]>} [invokedColumns]
 * @property {Cached<Row[]>} [invokedRows]
 * @property {Cached<UnfoldedColumn[]>} [unfoldedColumns]
 * @property {Cached<UnfoldedRow[]>} [unfoldedRows]
 * @property {Cached<ResolvedColumn[]>} [unfilteredColumns]
 * @property {Cached<ResolvedRow[]>} [unfilteredRows]
 * @property {Cached<Set<Key>>} [unfilteredColumnKeys]
 * @property {Cached<Set<Key>>} [unfilteredRowKeys]
 * @property {Cached<Key[]>} [columnsOrder]
 * @property {Cached<Key[]>} [rowsOrder]
 * @property {Cached<ResolvedColumn[]>} [orderedColumns]
 * @property {Cached<ResolvedRow[]>} [orderedRows]
 * @property {Cached<Rule[]>} [filterFormatting]
 * @property {Cached<FormattingRules>} [filterFormattingRules]
 * @property {Cached<FilteringRules>} [filteringRules]
 * @property {Cached<ResolvedColumn[]>} [filteredColumns]
 * @property {Cached<ResolvedRow[]>} [filteredRows]
 * @property {Cached<Rule[]>} [sortingFormatting]
 * @property {Cached<FormattingRules>} [sortingFormattingRules]
 * @property {Cached<SortingRules>} [sortingRules]
 * @property {Cached<ResolvedColumn[]>} [sortedColumns]
 * @property {Cached<ResolvedRow[]>} [sortedRows]
 * @property {Cached<Rule[]>} [measureFormatting]
 * @property {Cached<FormattingRules>} [measureFormattingRules]
 * @property {Cached<FormatResolver>} [measureFormatResolver]
 * @property {Cached<MeasuredColumn[]>} [measuredColumns]
 * @property {Cached<MeasuredRow[]>} [measuredRows]
 * @property {Cached<PlacedColumn[]>} [columns]
 * @property {Cached<PlacedRow[]>} [rows]
 * @property {Cached<ColumnLookup>} [columnLookup]
 * @property {Cached<RowLookup>} [rowLookup]
 * @property {Cached<Sections>} [sections]
 * @property {Cached<FixedSize>} [fixedSize]
 * @property {Cached<TotalSize>} [totalSize]
 * @property {Cached<CellId>} [hoveredCell]
 * @property {Cached<Id>} [resizableColumn]
 * @property {Cached<Id>} [resizableRow]
 * @property {Cached<CellId[]>} [highlightedCells]
 * @property {Cached<Selection_>} [selection]
 * @property {Cached<Selection_>} [highlight]
 * @property {Cached<Rule[]>} [renderFormatting]
 * @property {Cached<FormattingRules>} [renderFormattingRules]
 * @property {Cached<FormatResolver>} [renderFormatResolver]
 * @property {Cached<Rule[]>} [inputFormatting]
 * @property {Cached<FormattingRules>} [inputFormattingRules]
 * @property {Cached<FormatResolver>} [inputFormatResolver]
 * @property {Cached<EditableCell[]>} [editableCells]
 * @property {Cached<ElementPlacement>} [inputPlacement]
 * @property {Cached<boolean>} [isTextValid]
 * @property {Cached<Rule[]>} [contextFormatting]
 * @property {Cached<FormattingRules>} [contextFormattingRules]
 * @property {Cached<FormatResolver>} [contextFormatResolver]
 * @property {Cached<*>} [tooltip]
 * @property {Cached<TooltipPlacement>} [tooltipPlacement]
 * @property {Cached<Rect>} [scrollRect]
 * @property {Cached<Id[]>} [activeColumns]
 * @property {Cached<Id[]>} [activeRows]
 * @property {Cached<Id[]>} [activeColumnsCallback]
 * @property {Cached<Id[]>} [activeRowsCallback]
 * @property {Cached<CellId>} [hoveredCellCallback]
 */

/**
 * @callback RequestNewRenderFunction
 */