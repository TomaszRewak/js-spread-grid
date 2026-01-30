/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.Filter[]} filters
 * @returns {Types.ResolvedFilter[]}
 */
export default function getResolvedFilters(filters) {
    return filters.map(filter => ({
        columnId: 'columnId' in filter ? filter.columnId : 'FILTER',
        rowId: 'rowId' in filter ? filter.rowId : 'FILTER',
        expression: filter.expression
    }));
}