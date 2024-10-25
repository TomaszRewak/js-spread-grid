/**
 * @param {SortBy[]} sortBy
 * @returns {ResolvedSortBy[]}
 */
export default function getResolvedSortBy(sortBy) {
    return sortBy.map(sort => ({
        columnId: 'columnId' in sort ? sort.columnId : 'HEADER',
        rowId: 'rowId' in sort ? sort.rowId : 'HEADER',
        direction: sort.direction
    }));
}