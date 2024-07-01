/* eslint-disable import/prefer-default-export */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import createGrid from 'js-spread-grid';

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function useResolvedFormatting(formatting) {
    return useMemo(() => {
        const context = '{data, rows, columns, row, column, value, newValue, text, string, ctx}';

        return formatting.map(rule => {
            const mappedRule = {};

            if ('column' in rule)
                mappedRule.column = rule.column;
            if ('row' in rule)
                mappedRule.row = rule.row;
            if ('condition' in rule)
                mappedRule.condition = eval(`(${context}) => (${rule.condition})`);
            if ('value' in rule)
                mappedRule.value = eval(`(${context})=> (${rule.value})`);
            if ('text' in rule)
                mappedRule.text = eval(`(${context}) => (${rule.text})`);
            if ('style' in rule)
                mappedRule.style = isString(rule.style) ? eval(`(${context}) => (${rule.style})`) : rule.style;
            if ('padding' in rule)
                mappedRule.padding = isString(rule.padding) ? eval(`(${context}) => (${rule.padding})`) : rule.padding;
            if ('draw' in rule)
                mappedRule.draw = eval(`(${context}) => {${rule.draw}}`);
            if ('edit' in rule)
                if (rule.edit) {
                    const mappedEdit = {};
                    if ('validate' in rule.edit)
                        mappedEdit.validate = eval(`({string}) => (${rule.edit.validate})`);
                    if ('parse' in rule.edit)
                        mappedEdit.parse = eval(`(${context}) => (${rule.edit.parse})`);
                    if ('auto_commit' in rule.edit)
                        mappedEdit.autoCommit = rule.edit.auto_commit;
                    if ('toggle' in rule.edit)
                        mappedEdit.toggle = rule.edit.toggle;
                    mappedRule.edit = mappedEdit;
                }
                else {
                    mappedRule.edit = rule.edit;
                }

            return mappedRule;
        });
    }, [formatting]);
}

function useResolvedFiltering(filtering) {
    return useMemo(() => {
        const context = '{data, rows, columns, row, column, value, text, expression}';

        return filtering.map(rule => {
            const mappedRule = {};

            if ('column' in rule)
                mappedRule.column = rule.column;
            if ('row' in rule)
                mappedRule.row = rule.row;
            if ('condition' in rule)
                mappedRule.condition = eval(`(${context}) => (${rule.condition})`);

            return mappedRule;
        });
    }, [filtering]);
}

function useResolvedDataSelector(dataSelector) {
    return useMemo(() => {
        return eval(`({data, row, column}) => (${dataSelector})`);
    }, [dataSelector]);
}

// TODO: Write description
// TODO: Rename to DashSpreadGrid
function DashSpreadGrid(props) {
    // console.count('render DashSpreadGrid');

    const setProps = props.setProps;
    const counter = useRef(0);

    const data = props.data;
    const columns = props.columns;
    const rows = props.rows;
    const formatting = useResolvedFormatting(props.formatting);
    const filtering = useResolvedFiltering(props.filtering);
    const dataSelector = useResolvedDataSelector(props.data_selector);
    const pinnedTop = props.pinned_top;
    const pinnedBottom = props.pinned_bottom;
    const pinnedLeft = props.pinned_left;
    const pinnedRight = props.pinned_right;
    const selectedCells = props.selected_cells;
    const onSelectedCellsChange = useCallback((selectedCells) => {
        setProps({ selected_cells: selectedCells });
    }, [setProps]);
    const filters = props.filters;
    const onFiltersChange = useCallback((filters) => {
        setProps({ filters });
    }, [setProps]);
    const editedCells = props.edited_cells;
    const onEditedCellsChange = useCallback((editedCells) => {
        setProps({ edited_cells: editedCells });
    }, [setProps]);
    const clickedCell = props.clicked_cell;
    const onCellClick = useCallback((cell) => {
        setProps({ clicked_cell: { ...cell, n: counter.current++ } });
    }, [setProps]);
    const clickedCustomCell = props.clicked_custom_cell;
    const onCustomCellClick = useCallback((cell) => {
        setProps({ clicked_custom_cell: { ...cell, n: counter.current++ } });
    }, [setProps]);
    const columnWidths = props.column_widths;
    const onColumnWidthsChange = useCallback((columnWidths) => {
        setProps({ column_widths: columnWidths });
    }, [setProps]);
    const rowHeights = props.row_heights;
    const onRowHeightsChange = useCallback((rowHeights) => {
        setProps({ row_heights: rowHeights });
    }, [setProps]);
    const columnsOrder = props.columns_order;
    const onColumnsOrderChange = useCallback((columnsOrder) => {
        setProps({ columns_order: columnsOrder });
    }, [setProps]);
    const rowsOrder = props.rows_order;
    const onRowsOrderChange = useCallback((rowsOrder) => {
        setProps({ rows_order: rowsOrder });
    }, [setProps]);
    const onActiveColumnsChange = useCallback((activeColumns) => {
        setProps({ active_columns: activeColumns });
    }, [setProps]);
    const onActiveRowsChange = useCallback((activeRows) => {
        setProps({ active_rows: activeRows });
    }, [setProps]);
    const onHoveredCellChange = useCallback((hoveredCell) => {
        setProps({ hovered_cell: hoveredCell });
    }, [setProps]);

    const [element, setElement] = useState(null);

    if (element)
        createGrid(element, {
            data,
            columns,
            rows,
            formatting,
            filtering,
            pinnedTop,
            pinnedBottom,
            pinnedLeft,
            pinnedRight,
            dataSelector,
            selectedCells,
            onSelectedCellsChange,
            editedCells,
            onEditedCellsChange,
            filters,
            onFiltersChange,
            columnWidths,
            onColumnWidthsChange,
            rowHeights,
            onRowHeightsChange,
            columnsOrder,
            onColumnsOrderChange,
            rowsOrder,
            onRowsOrderChange,
            clickedCell,
            onCellClick,
            clickedCustomCell,
            onCustomCellClick,
            onActiveColumnsChange,
            onActiveRowsChange,
            onHoveredCellChange,
        });

    return React.createElement("div", { ref: setElement });
};

// TODO: add descriptions
// TODO: Fix types
DashSpreadGrid.propTypes = {
    // _
    setProps: PropTypes.func,
    // _
    id: PropTypes.string,
    // _
    data: PropTypes.any,
    // _
    columns: PropTypes.array,
    // _
    rows: PropTypes.array,
    // _
    formatting: PropTypes.array,
    // _
    filtering: PropTypes.array,
    // _
    sorting: PropTypes.array,
    // _
    data_selector: PropTypes.string,
    // _
    pinned_top: PropTypes.number,
    // _
    pinned_bottom: PropTypes.number,
    // _
    pinned_left: PropTypes.number,
    // _
    pinned_right: PropTypes.number,
    // _
    borderWidth: PropTypes.number,
    // _
    focusedCell: PropTypes.object,
    // _
    selected_cells: PropTypes.array,
    // _
    highlightedCells: PropTypes.array,
    // _
    edited_cells: PropTypes.array,
    // _
    filters: PropTypes.array,
    // _
    sort_by: PropTypes.array,
    // _
    column_widths: PropTypes.array,
    // _
    row_heights: PropTypes.array,
    // _
    columns_order: PropTypes.array,
    // _
    rows_order: PropTypes.array,
    // _
    clicked_cell: PropTypes.object,
    // _
    clicked_custom_cell: PropTypes.object,
    // _
    active_columns: PropTypes.array,
    // _
    active_rows: PropTypes.array,
    // _
    hovered_cell: PropTypes.object,
};

DashSpreadGrid.defaultProps = {
    data: [],
    columns: [{ "type": "DATA-BLOCK" }],
    rows: [{ "type": "HEADER" }, { "type": "DATA-BLOCK" }],
    formatting: [],
    filtering: [],
    sorting: [],
    data_selector: "data[row.id][column.id]",
    pinned_top: 0,
    pinned_bottom: 0,
    pinned_left: 0,
    pinned_right: 0,
    borderWidth: 1,
    focusedCell: null,
    selected_cells: [],
    highlightedCells: [],
    edited_cells: [],
    filters: [],
    sort_by: [],
    column_widths: [],
    row_heights: [],
    columns_order: [],
    rows_order: [],
    clicked_cell: null,
    clicked_custom_cell: null,
    active_columns: [],
    active_rows: [],
    hovered_cell: null,
};

export default DashSpreadGrid;
