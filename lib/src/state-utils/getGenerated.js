/**
 * @param {Column[] | ColumnGenerator} columns
 * @param {Data} data
 * @returns {Column[]}
 */
export function getGeneratedColumns(columns, data) {
    return typeof columns === 'function'
        ? columns(data)
        : columns;
}

/**
 * @param {Row[] | RowGenerator} rows
 * @param {Data} data
 * @returns {Row[]}
 */
export function getGeneratedRows(rows, data) {
    return typeof rows === 'function'
        ? rows(data)
        : rows;
}