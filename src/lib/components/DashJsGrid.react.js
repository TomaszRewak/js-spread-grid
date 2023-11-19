/* eslint-disable import/prefer-default-export */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';
import StyleResolver from '../utils/StyleResolver';

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

function useResolvedCellStyle(cellStyle) {
    return useMemo(() => {
        return cellStyle.map(style => ({
            column: style.column,
            row: style.row,
            condition: eval(`(value) => (${style.condition || 'true'})`),
            style: eval(`(value) => (${style.style})`)
        }));
    }, [cellStyle]);
}

function useResolvedProps(props) {
    const data = props.data;
    const columns = useResolvedColumns(props.columns);
    const rows = useResolvedRows(props.rows);
    const valueSelector = useResolvedValueSelector(props.valueSelector);
    const fixedColumns = props.fixedColumns;
    const fixedRows = props.fixedRows;
    const cellStyle = useResolvedCellStyle(props.cellStyle);

    return {
        data,
        columns,
        rows,
        valueSelector,
        fixedColumns,
        fixedRows,
        cellStyle
    }
}

function DashJsGrid(props) {
    const { data, columns, rows, valueSelector, fixedColumns, fixedRows, cellStyle } = useResolvedProps(props);

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

    const styleResolver = useMemo(() => {
        return new StyleResolver(cellStyle);
    }, [cellStyle]);

    // TODO: useMemo
    const leftColumns = columnDefinitions.slice(0, fixedColumns);
    const rightColumns = columnDefinitions.slice(fixedColumns);
    const topRows = rowDefinitions.slice(0, fixedRows);
    const bottomRows = rowDefinitions.slice(fixedRows);
    const topRowsWithHeader = [{ id: 'header', height: 20 }, ...topRows]; // TODO: Is that the best way of doing that?

    // TODO: useMemo
    // TODO: move somewhere else
    const produceCells = (data, columns, rows, includeHeaders, columnOffset, rowOffset) => {
        const cells = rows.map((row, rowIndex) => {
            return columns.map((column, columnIndex) => {
                const value = valueSelector(data, row.id, column.id);
                const style = styleResolver.resolve(column.id, columnIndex + columnOffset, row.id, rowIndex + rowOffset, value);

                return {
                    value,
                    style
                };
            });
        });

        if (!includeHeaders)
            return cells;

        // TODO: style headers
        return [
            columns.map(column => ({ value: column.header, style: { background: 'lightgrey' } })),
            ...cells
        ];
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    cells={produceCells(data, leftColumns, topRows, true, 0, 0)}
                    columns={leftColumns}
                    rows={topRowsWithHeader}
                    showLeftBorder
                    showTopBorder
                />
                <GridCanvas
                    cells={produceCells(data, rightColumns, topRows, true, fixedColumns, 0)}
                    columns={rightColumns}
                    rows={topRowsWithHeader}
                    showTopBorder
                />
            </div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    cells={produceCells(data, leftColumns, bottomRows, false, 0, fixedRows)}
                    columns={leftColumns}
                    rows={bottomRows}
                    showLeftBorder
                />
                <GridCanvas
                    cells={produceCells(data, rightColumns, bottomRows, false, fixedColumns, fixedRows)}
                    columns={rightColumns}
                    rows={bottomRows}
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
    // TODO: Make the fixed columns/rows be defined in column/now definitions
    fixedColumns: PropTypes.number,
    //
    fixedRows: PropTypes.number,
    //
    cellStyle: PropTypes.arrayOf(
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
            style: PropTypes.string
        })
    )
};

DashJsGrid.defaultProps = {
    data: [],
    columns: 'data.length > 0 ? Object.keys(data[0]).map((key) => ({id: key, header: key, width: 100})) : []',
    rows: 'data.map((_, index) => ({id: index, height: 20}))',
    valueSelector: 'data[rowId][columnId]',
    fixedColumns: 0,
    fixedRows: 0,
    cellStyle: [{ column: { match: 'HEADER' }, style: '{background: "lightgrey"}' }]
};

export default DashJsGrid;
