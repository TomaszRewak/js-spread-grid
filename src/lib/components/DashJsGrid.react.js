/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';

function DashJsGrid({ data, columns, rowHeight, fixedColumns, fixedRows, rowSelector }) {
    const leftColumns = columns.slice(0, fixedColumns);
    const rightColumns = columns.slice(fixedColumns);

    const minIndex = 0;
    const maxIndex = data.length;

    const rowSelectorFunc = eval(`(data, rowIndex) => ${rowSelector}`);

    // TODO: move somewhere else
    const produceCells = (columns, data, start, end, includeHeaders) => {
        const rows = new Array(end - start).fill(0).map((_, index) => rowSelectorFunc(data, start + index));
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
                    cells={produceCells(leftColumns, data, minIndex, fixedRows, true)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                    showTopBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(rightColumns, data, minIndex, fixedRows, true)}
                    columnWidths={[100, 151, 33]}
                    showTopBorder
                />
            </div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(leftColumns, data, fixedRows, maxIndex, false)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(rightColumns, data, fixedRows, maxIndex, false)}
                    columnWidths={[100, 151, 33]}
                />
            </div>
        </div>
    );
};

// TODO: add descriptions
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
    fixedRows: PropTypes.number
};

DashJsGrid.defaultProps = {
    data: [],
    columns: null,
    rowHeight: 20,
    rowSelector: 'data[rowIndex]',
    fixedColumns: 0,
    fixedRows: 0
};

export default DashJsGrid;
