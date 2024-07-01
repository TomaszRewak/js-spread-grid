function getDefaultIds(elements) {
    if (!Array.isArray(elements))
        return Object.keys(elements);

    return elements.map((_, index) => index);
}

function getDefaultRowIds(data) {
    return getDefaultIds(data);
}

function getDefaultColumnIds(data) {
    const keys = new Set();

    if (Array.isArray(data)) {
        for (const element of data) {
            for (const id of getDefaultIds(element))
                keys.add(id);
        }
    } else {
        for (const key in data) {
            for (const id of getDefaultIds(data[key]))
                keys.add(id);
        }
    }

    return Array.from(keys);
}

export function getUnfoldedColumns(columns, data) {
    const hasDataBlocks = columns.some(column => column.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return columns;

    const unfoldedColumns = [];

    for (const column of columns) {
        if (column.type === 'DATA-BLOCK') {
            const ids = 'selector' in column
                ? column.selector(data)
                : getDefaultColumnIds(data);

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
            const ids = 'selector' in row
                ? row.selector(data)
                : getDefaultRowIds(data);

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