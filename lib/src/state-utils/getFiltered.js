/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {Types.ResolvedFilter[]} filters
 * @param {"columnId" | "rowId"} primaryKey
 * @param {"columnId" | "rowId"} secondaryKey
 * @returns {Map<Types.Key, Map<Types.Key, Types.Value>>}
 */
function getFilterLookup(filters, primaryKey, secondaryKey) {
    /** @type {Map<Types.Key, Map<Types.Key, Types.Value>>} */
    const filterLookup = new Map();
    for (const cell of filters) {
        const primary = stringifyId(cell[primaryKey]);
        const secondary = stringifyId(cell[secondaryKey]);

        if (!filterLookup.has(primary))
            filterLookup.set(primary, new Map());

        filterLookup.get(primary).set(secondary, cell.expression);
    }
    return filterLookup;
}

/**
 * @param {Types.ResolvedFilter[]} filters
 * @param {Types.FilteringRules} filteringRules
 * @param {Types.FormattingRules} formattingRules
 * @param {object} data
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.Edition} edition
 * @returns {Types.ResolvedRow[]}
 */
export function getFilteredRows(filters, filteringRules, formattingRules, data, rows, columns, edition) {
    if (filters.length === 0)
        return rows;

    const filterLookup = getFilterLookup(filters, 'columnId', 'rowId');
    const filteredColumns = columns.filter(column =>
        column.type !== 'FILTER' &&
        column.type !== 'DYNAMIC-BLOCK' &&
        filterLookup.has(column.key));

    if (filteredColumns.length === 0)
        return rows;

    return rows.filter(row => {
        if (row.type === 'DYNAMIC-BLOCK')
            return true;

        for (const column of filteredColumns) {
            if (column.type === 'DYNAMIC-BLOCK')
                continue;

            const cell = formattingRules.resolve(data, rows, columns, row, column, edition);
            const columnFilters = filterLookup.get(column.key);
            const visible = filteringRules.resolve(data, rows, columns, row, column, cell.value, cell.text, columnFilters);

            if (!visible)
                return false;
        }
        return true;
    });
}

/**
 * @param {Types.ResolvedFilter[]} filters
 * @param {Types.FilteringRules} filteringRules
 * @param {Types.FormattingRules} formattingRules
 * @param {object} data
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.Edition} edition
 * @returns {Types.ResolvedColumn[]}
 */
export function getFilteredColumns(filters, filteringRules, formattingRules, data, rows, columns, edition) {
    if (filters.length === 0)
        return columns;

    const filterLookup = getFilterLookup(filters, 'rowId', 'columnId');
    const filteredRows = rows.filter(row =>
        row.type !== 'FILTER' &&
        row.type !== 'DYNAMIC-BLOCK' &&
        filterLookup.has(row.key));

    if (filteredRows.length === 0)
        return columns;

    return columns.filter(column => {
        if (column.type === 'DYNAMIC-BLOCK')
            return true;

        for (const row of filteredRows) {
            if (row.type === 'DYNAMIC-BLOCK')
                continue;

            const cell = formattingRules.resolve(data, rows, columns, row, column, edition);
            const rowFilters = filterLookup.get(row.key);
            const visible = filteringRules.resolve(data, rows, columns, row, column, cell.value, cell.text, rowFilters);

            if (!visible)
                return false;
        }
        return true;
    });
}