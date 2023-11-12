/* eslint-disable import/prefer-default-export */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';

function useResolvedRowSelector(rowSelector) {
    return useMemo(() => {
        return eval(`(data, rowIndex) => ${rowSelector}`)
    }, [rowSelector])
}

function useResolvedProps(props) {
    const data = props.data;
    const columns = props.columns;
    const rowHeight = props.rowHeight;
    const minRowIndex = props.minRowIndex === null ? 0 : props.minRowIndex;
    const maxRowIndex = props.maxRowIndex === null ? data.length : props.maxRowIndex;
    const fixedColumns = Math.min(props.fixedColumns, columns.length);
    const fixedRows = Math.min(props.fixedRows, maxRowIndex - minRowIndex);
    const rowSelector = useResolvedRowSelector(props.rowSelector);

    return {
        data,
        columns,
        rowHeight,
        minRowIndex,
        maxRowIndex,
        fixedColumns,
        fixedRows,
        rowSelector
    }
}

function DashJsGrid(props) {
    const { data, columns, rowHeight, fixedColumns, fixedRows, rowSelector, minRowIndex, maxRowIndex } = useResolvedProps(props);

    const leftColumns = columns.slice(0, fixedColumns);
    const rightColumns = columns.slice(fixedColumns);

    // TODO: move somewhere else
    const produceCells = (columns, data, start, end, includeHeaders) => {
        const rows = new Array(end - start).fill(0).map((_, index) => rowSelector(data, start + index));
        const cells = rows.map(row => columns.map(column => ({ value: row[column] })));

        if (!includeHeaders)
            return cells;

        return [
            columns.map(column => ({ value: column, background: 'lightgrey' })),
            ...cells
        ];
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(leftColumns, data, minRowIndex, fixedRows, true)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                    showTopBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(rightColumns, data, minRowIndex, fixedRows, true)}
                    columnWidths={[100, 151, 33]}
                    showTopBorder
                />
            </div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(leftColumns, data, fixedRows, maxRowIndex, false)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(rightColumns, data, fixedRows, maxRowIndex, false)}
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
    columns: PropTypes.array,
    //
    rowHeight: PropTypes.number,
    //
    rowSelector: PropTypes.string,
    //
    fixedColumns: PropTypes.number,
    //
    fixedRows: PropTypes.number,
    //
    minRowIndex: PropTypes.number,
    //
    maxRowIndex: PropTypes.number
};

DashJsGrid.defaultProps = {
    data: [],
    columns: null,
    rowHeight: 20,
    rowSelector: 'data[rowIndex]',
    fixedColumns: 0,
    fixedRows: 0,
    minRowIndex: null,
    maxRowIndex: null
};

export default DashJsGrid;
