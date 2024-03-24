export function getUnfoldedColumns(columns, data) {
    const hasDataBlocks = columns.some(column => column.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return columns;

    const unfoldedColumns = [];

    for (const column of columns) {
        if (column.type === 'DATA-BLOCK') {
            const selector = 'selector' in column
                ? column.selector
                : () => (data.length > 0 ? Object.keys(data[0]) : []);
            const ids = selector(data);

            for (const id of ids) {
                unfoldedColumns.push({
                    ...column,
                    id,
                    type: 'DATA'
                });
            }
        } else {
            unfoldedColumns.push(column);
        }
    }

    return unfoldedColumns;
}

export function getUnfoldedRows(rows, data) {
    const hasDataBlocks = rows.some(row => row.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return rows;

    const unfoldedRows = [];

    for (const row of rows) {
        if (row.type === 'DATA-BLOCK') {
            const selector = 'selector' in row
                ? row.selector
                : () => data.map((_, index) => index);
            const ids = selector(data);

            for (const id of ids) {
                unfoldedRows.push({
                    ...row,
                    id,
                    type: 'DATA'
                });
            }
        } else {
            unfoldedRows.push(row);
        }
    }

    return unfoldedRows;
}