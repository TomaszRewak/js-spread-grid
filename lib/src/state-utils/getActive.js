/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.ResolvedDimension[]} entries
 * @returns {Types.Id[]}
 */
function getActive(entries) {
    const ids = entries
        .filter(entry => entry.type === 'DATA')
        .map(entry => entry.id);

    return ids;
}

/**
 * @param {Types.ResolvedColumn[]} columns
 * @returns {Types.Id[]}
 */
export function getActiveColumns(columns) {
    return getActive(columns);
}

/**
 * @param {Types.ResolvedRow[]} rows
 * @returns {Types.Id[]}
 */
export function getActiveRows(rows) {
    return getActive(rows);
}