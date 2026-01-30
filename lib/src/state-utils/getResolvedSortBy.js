/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.SortBy[]} sortBy
 * @returns {Types.ResolvedSortBy[]}
 */
export default function getResolvedSortBy(sortBy) {
    return sortBy.map(sort => ({
        columnId: 'columnId' in sort ? sort.columnId : 'HEADER',
        rowId: 'rowId' in sort ? sort.rowId : 'HEADER',
        direction: sort.direction
    }));
}