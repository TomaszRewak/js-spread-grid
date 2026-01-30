/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.Column[] | Types.ColumnGenerator} columns
 * @param {Types.Data} data
 * @returns {Types.Column[]}
 */
export function getGeneratedColumns(columns, data) {
    return typeof columns === 'function'
        ? columns(data)
        : columns;
}

/**
 * @param {Types.Row[] | Types.RowGenerator} rows
 * @param {Types.Data} data
 * @returns {Types.Row[]}
 */
export function getGeneratedRows(rows, data) {
    return typeof rows === 'function'
        ? rows(data)
        : rows;
}