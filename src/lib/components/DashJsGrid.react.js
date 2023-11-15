/* eslint-disable import/prefer-default-export */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';

function useResolvedValueSelector(valueSelector) {
    return useMemo(() => {
        return eval(`(data, rowId, columnId) => (${valueSelector})`);
    }, [valueSelector])
}

function useResolvedColumns(columns) {
    return useMemo(() => {
        if (typeof columns !== 'string')
            return columns;

        return eval(`(data) => (${columns})`);
    }, [columns]);
}

function useResolvedRows(rows) {
    return useMemo(() => {
        if (typeof rows !== 'string')
            return rows;

        return eval(`(data) => (${rows})`);
    }, [rows]);
}

function useResolvedProps(props) {
    const data = props.data;
    const columns = useResolvedColumns(props.columns);
    const rows = useResolvedRows(props.rows);
    const valueSelector = useResolvedValueSelector(props.valueSelector);
    const fixedColumns = props.fixedColumns;
    const fixedRows = props.fixedRows;

    return {
        data,
        columns,
        rows,
        valueSelector,
        fixedColumns,
        fixedRows
    }
}

function DashJsGrid(props) {
    const { data, columns, rows, valueSelector, fixedColumns, fixedRows } = useResolvedProps(props);

    const columnDefinitions = useMemo(() => {
        if (typeof columns === 'function')
            return columns(data);

        return columns;
    }, [columns, data]);

    const rowDefinitions = useMemo(() => {
        if (typeof rows === 'function')
            return rows(data);

        return rows;
    }, [rows, data]);

    const leftColumns = columnDefinitions.slice(0, fixedColumns);
    const rightColumns = columnDefinitions.slice(fixedColumns);
    const topRows = rowDefinitions.slice(0, fixedRows);
    const bottomRows = rowDefinitions.slice(fixedRows);

    // TODO: move somewhere else
    const produceCells = (data, columns, rows, includeHeaders) => {
        const cells = rows.map(row => {
            return columns.map(column => {
                return {
                    value: valueSelector(data, row.id, column.id)
                };
            });
        });

        if (!includeHeaders)
            return cells;

        return [
            columns.map(column => ({ value: column.header, background: 'lightgrey' })),
            ...cells
        ];
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={20}
                    cells={produceCells(data, leftColumns, topRows, true)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                    showTopBorder
                />
                <GridCanvas
                    rowHeight={20}
                    cells={produceCells(data, rightColumns, topRows, true)}
                    columnWidths={[100, 151, 33]}
                    showTopBorder
                />
            </div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={20}
                    cells={produceCells(data, leftColumns, bottomRows, false)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                />
                <GridCanvas
                    rowHeight={20}
                    cells={produceCells(data, rightColumns, bottomRows, false)}
                    columnWidths={[100, 151, 33]}
                />
            </div>
        </div>
    );
};

// TODO: add descriptions
// TODO: fixing rows to top and bottom
DashJsGrid.propTypes = {
    //
    data: PropTypes.array,
    //
    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rows: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    valueSelector: PropTypes.string,
    //
    fixedColumns: PropTypes.number,
    //
    fixedRows: PropTypes.number,
};

DashJsGrid.defaultProps = {
    data: [],
    columns: 'data.length > 0 ? Object.keys(data[0]).map((key) => ({id: key, header: key, width: 100})) : []',
    rows: 'data.map((_, index) => ({id: index, height: 20}))',
    valueSelector: 'data[rowId][columnId]',
    fixedColumns: 0,
    fixedRows: 0
};

export default DashJsGrid;
