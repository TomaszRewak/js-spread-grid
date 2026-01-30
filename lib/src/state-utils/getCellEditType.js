/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.ResolvedColumn} column
 * @param {Types.ResolvedRow} row
 * @returns {Types.EditDimensionType}
 */
export default function getCellEditType(column, row) {
    const isFilterColumn = column.type === 'FILTER';
    const isFilterRow = row.type === 'FILTER';

    if (isFilterColumn && !isFilterRow)
        return 'FILTER';
    if (!isFilterColumn && isFilterRow)
        return 'FILTER';

    return 'DATA';
}