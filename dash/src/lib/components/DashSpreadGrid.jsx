/* eslint-disable import/prefer-default-export */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StateProvider } from '../../../../js/contexts/StateContext';
import Grid from '../../../../js/fragments/Grid';

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function useResolvedColumns(columns) {
    return useMemo(() => {
        if (isString(columns))
            return eval(`(data) => (${columns})`);

        return columns;
    }, [columns]);
}

function useResolvedRows(rows) {
    return useMemo(() => {
        if (isString(rows))
            return eval(`(data) => (${rows})`);

        return rows;
    }, [rows]);
}

function useResolvedFormatting(formatting) {
    return useMemo(() => {
        return formatting.map(rule => {
            const mappedRule = {};

            if ('column' in rule)
                mappedRule.column = rule.column;
            if ('row' in rule)
                mappedRule.row = rule.row;
            if ('condition' in rule)
                mappedRule.condition = eval(`(data, rows, columns, row, column, value) => (${rule.condition})`);
            if ('style' in rule)
                mappedRule.style = isString(rule.style) ? eval(`(data, rows, columns, row, column, value) => (${rule.style})`) : rule.style;
            if ('value' in rule)
                mappedRule.value = eval(`(data, rows, columns, row, column, value) => (${rule.value})`);

            return mappedRule;
        });
    }, [formatting]);
}

function useCombinedFormatting(defaultFormatting, formatting) {
    const resolvedDefaultFormatting = useResolvedFormatting(defaultFormatting);
    const resolvedFormatting = useResolvedFormatting(formatting);

    return useMemo(() => {
        return [
            ...resolvedDefaultFormatting,
            ...resolvedFormatting
        ];
    }, [resolvedDefaultFormatting, resolvedFormatting]);
}

// TODO: Write description
// TODO: Rename to DashSpreadGrid
function DashSpreadGrid(props) {
    console.count('render DashSpreadGrid');

    const data = props.data;
    const columns = useResolvedColumns(props.columns);
    const columnsLeft = useResolvedColumns(props.columnsLeft);
    const columnsRight = useResolvedColumns(props.columnsRight);
    const rows = useResolvedRows(props.rows);
    const rowsTop = useResolvedRows(props.rowsTop);
    const rowsBottom = useResolvedRows(props.rowsBottom);
    const formatting = useCombinedFormatting(props.defaultFormatting, props.formatting);
    const hoveredCell = props.hoveredCell;
    const focusedCell = props.focusedCell;
    const selectedCells = props.selectedCells;

    // eslint-disable-next-line react/prop-types
    const setProps = props.setProps;

    const setSelectedCells = useCallback(selectedCells => setProps({ selectedCells }), [setProps]);
    const setHoveredCell = useCallback(hoveredCell => setProps({ hoveredCell }), [setProps]);
    const setFocusedCell = useCallback(focusedCell => setProps({ focusedCell }), [setProps]);

    return (
        <StateProvider
            data={data}
            columnsLeft={columnsLeft}
            columns={columns}
            columnsRight={columnsRight}
            rowsTop={rowsTop}
            rows={rows}
            rowsBottom={rowsBottom}
            selectedCells={selectedCells}
            hoveredCell={hoveredCell}
            focusedCell={focusedCell}
            formatting={formatting}
            onSelectedCellsChange={setSelectedCells}
            onHoveredCellChange={setHoveredCell}
            onFocusedCellChange={setFocusedCell}
        >
            <Grid />
        </StateProvider>
    );
};

// TODO: add descriptions
// TODO: Fix types
DashSpreadGrid.propTypes = {
    //
    id: PropTypes.string,
    //
    data: PropTypes.array,
    //
    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    columnsLeft: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    columnsRight: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rows: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rowsTop: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rowsBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    defaultFormatting: PropTypes.arrayOf(PropTypes.any), // TODO: Fix type
    //
    formatting: PropTypes.arrayOf(
        PropTypes.shape({
            column: PropTypes.oneOfType([
                PropTypes.shape({ match: PropTypes.oneOf(['ANY', 'LEFT', 'RIGHT', 'HEADER']) }),
                PropTypes.shape({ id: PropTypes.any }),
                PropTypes.shape({ index: PropTypes.number }),
            ]),
            row: PropTypes.oneOfType([
                PropTypes.shape({ match: PropTypes.oneOf(['ANY', 'TOP', 'BOTTOM', 'HEADER']) }),
                PropTypes.shape({ id: PropTypes.any }),
                PropTypes.shape({ index: PropTypes.number }),
            ]),
            condition: PropTypes.string,
            // TODO: Make this also accept style objects
            style: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
            text: PropTypes.string
        })
    ),
    //
    hoveredCell: PropTypes.shape({
        rowId: PropTypes.any,
        columnId: PropTypes.any
    }),
    //
    focusedCell: PropTypes.shape({
        rowId: PropTypes.any,
        columnId: PropTypes.any
    }),
    //
    selectedCells: PropTypes.arrayOf(
        PropTypes.shape({
            rowId: PropTypes.any,
            columnId: PropTypes.any
        })
    )
};

DashSpreadGrid.defaultProps = {
    data: [],
    columns: 'data.length > 0 ? Object.keys(data[0]).map((key) => ({id: key, header: key, width: 100})) : []',
    columnsLeft: [],
    columnsRight: [],
    rows: 'data.map((_, index) => ({id: index, height: 20}))',
    rowsTop: [{ type: 'HEADER', height: 20 }],
    rowsBottom: [],
    defaultFormatting: [
        { column: { match: 'ANY' }, row: { match: 'HEADER' }, style: '{background: "#F5F5F5", border: {width: 1, color: "gray"}}', value: 'column.header' },
        // TODO: Make sure that rules with "value" don't have any other fields
        { value: 'data[row.id][column.id]' }
    ],
    formatting: [],
    hoveredCell: null,
    focusedCell: null,
    selectedCells: []
};

export default DashSpreadGrid;
