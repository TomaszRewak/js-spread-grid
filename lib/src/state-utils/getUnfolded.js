/** @import * as Types from "../typings.js"; */

/**
 * @param {*} elements
 * @returns {Types.Selector[]}
 */
function getDefaultSelectors(elements) {
    if (!Array.isArray(elements))
        return Object.keys(elements);

    return elements.map((_, index) => index);
}

/**
 * @param {Types.Data} data
 * @returns {Types.Id[]}
 */
function getDefaultRowSelectors(data) {
    return getDefaultSelectors(data);
}

/**
 * @param {Types.Data} data
 * @returns {Types.Selector[]}
 */
function getDefaultColumnSelectors(data) {
    const keys = new Set();

    if (Array.isArray(data)) {
        for (const element of data) {
            for (const id of getDefaultSelectors(element))
                keys.add(id);
        }
    } else {
        for (const key in data) {
            for (const id of getDefaultSelectors(data[key]))
                keys.add(id);
        }
    }

    return Array.from(keys);
}

/**
 * @param {Types.Column[]} columns
 * @param {Types.Data} data
 * @returns {Types.UnfoldedColumn[]}
 */
export function getUnfoldedColumns(columns, data) {
    const hasDataBlocks = columns.some(column => column.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return /** @type {Types.UnfoldedColumn[]} */ (columns);

    /** @type {Types.UnfoldedColumn[]} */
    const unfoldedColumns = [];

    for (const column of columns) {
        if (column.type === 'DATA-BLOCK') {
            const selectors = 'selector' in column
                ? column.selector({ data })
                : getDefaultColumnSelectors(data);

            /** @type {Types.DimensionIdFunction} */
            const id = 'id' in column
                ? column.id
                : ({ selector }) => selector;

            for (const selector of selectors) {
                unfoldedColumns.push({
                    ...column,
                    id: id({ data, selector }),
                    selector: selector,
                    type: 'DATA'
                });
            }
        } else {
            unfoldedColumns.push(/** @type {Types.UnfoldedColumn} */(column));
        }
    }

    return unfoldedColumns;
}

/**
 * @param {Types.Row[]} rows
 * @param {Types.Data} data
 * @returns {Types.UnfoldedRow[]}
 */
export function getUnfoldedRows(rows, data) {
    const hasDataBlocks = rows.some(row => row.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return /** @type {Types.UnfoldedRow[]} */ (rows);

    /** @type {Types.UnfoldedRow[]} */
    const unfoldedRows = [];

    for (const row of rows) {
        if (row.type === 'DATA-BLOCK') {
            const selectors = 'selector' in row
                ? row.selector({ data })
                : getDefaultRowSelectors(data);

            /** @type {Types.DimensionIdFunction} */
            const id = 'id' in row
                ? row.id
                : ({ selector }) => selector;

            for (const selector of selectors) {
                unfoldedRows.push({
                    ...row,
                    id: id({ data, selector }),
                    selector,
                    type: 'DATA'
                });
            }
        } else {
            unfoldedRows.push(/** @type {Types.UnfoldedRow} */(row));
        }
    }

    return unfoldedRows;
}