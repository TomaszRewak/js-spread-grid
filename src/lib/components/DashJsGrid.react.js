/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';

function DashJsGrid({ data, columns, rowHeight, fixedColumns, fixedRows }) {
    const leftColumns = columns.slice(0, fixedColumns);
    const rightColumns = columns.slice(fixedColumns);

    const topData = data.slice(0, fixedRows);
    const bottomData = data.slice(fixedRows);

    // TODO: move somewhere else
    const produceCells = (columns, rows, includeHeaders) => {
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
                    cells={produceCells(leftColumns, topData, true)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                    showTopBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(rightColumns, topData, true)}
                    columnWidths={[100, 151, 33]}
                    showTopBorder
                />
            </div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(leftColumns, bottomData, false)}
                    columnWidths={[50, 67]}
                    showLeftBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={produceCells(rightColumns, bottomData, false)}
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
    dataSelector: PropTypes.string,
    //
    fixedColumns: PropTypes.number,
    //
    fixedRows: PropTypes.number
};

DashJsGrid.defaultProps = {
    data: [],
    columns: null,
    rowHeight: 20,
    dataSelector: 'data[rowIndex]',
    fixedColumns: 0,
    fixedRows: 0
};

export default DashJsGrid;
