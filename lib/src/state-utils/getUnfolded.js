/**
 * @param {*} elements
 * @returns {Id[]}
 */
function getDefaultIds(elements) {
    if (!Array.isArray(elements))
        return Object.keys(elements);

    return elements.map((_, index) => index);
}

/**
 * @param {Data} data
 * @returns {Id[]}
 */
function getDefaultRowIds(data) {
    return getDefaultIds(data);
}

/**
 * @param {Data} data
 * @returns {Id[]}
 */
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

/**
 * @param {Column[]} columns
 * @param {Data} data
 * @returns {UnfoldedColumn[]}
 */
export function getUnfoldedColumns(columns, data) {
    const hasDataBlocks = columns.some(column => column.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return /** @type {Dimension[]} */ (columns);

    /** @type {UnfoldedColumn[]} */
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
            unfoldedColumns.push(/** @type {Dimension} */(column));
        }
    }

    return unfoldedColumns;
}

/**
 * @param {Row[]} rows
 * @param {Data} data
 * @returns {UnfoldedRow[]}
 */
export function getUnfoldedRows(rows, data) {
    const hasDataBlocks = rows.some(row => row.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return /** @type {Dimension[]} */ (rows);

    /** @type {UnfoldedRow[]} */
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
            unfoldedRows.push(/** @type {Dimension} */(row));
        }
    }

    return unfoldedRows;
}