
/**
 * @param {ResolvedDimension[]} entries
 * @returns {Id[]}
 */
function getActive(entries) {
    const ids = entries
        .filter(entry => entry.type === 'DATA')
        .map(entry => entry.id);

    return ids;
}

/**
 * @param {ResolvedColumn[]} columns
 * @returns {Id[]}
 */
export function getActiveColumns(columns) {
    return getActive(columns);
}

/**
 * @param {ResolvedRow[]} rows
 * @returns {Id[]}
 */
export function getActiveRows(rows) {
    return getActive(rows);
}