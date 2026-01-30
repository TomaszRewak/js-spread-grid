/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

/**
 * @template {Types.ResolvedDimension} T
 * @typedef TempSortingEntry
 * @property {T} entity
 * @property {Types.SortingComparator} comparator
 * @property {Types.Cell} cell
 */

/**
 * @param {Types.ResolvedSortBy[]} sortBy
 * @param {keyof Types.CellId} primaryKey
 * @param {keyof Types.CellId} secondaryKey
 * @returns {Map<string, Map<string, Types.SortDirection>>}
 */
function getSortByLookup(sortBy, primaryKey, secondaryKey) {
    const sortByLookup = new Map();
    for (const cell of sortBy) {
        const primary = stringifyId(cell[primaryKey]);
        const secondary = stringifyId(cell[secondaryKey]);

        if (!sortByLookup.has(primary))
            sortByLookup.set(primary, new Map());

        sortByLookup.get(primary).set(secondary, cell.direction);
    }
    return sortByLookup;
}

/**
 * @template {Types.ResolvedDimension} T
 * @param {TempSortingEntry<T>[]} temp
 * @param {T[]} result
 */
function flush(temp, result) {
    temp.sort((lhs, rhs) => {
        const result = lhs.comparator(lhs.cell, rhs.cell);
        if (typeof result === 'number')
            return result;
        return result ? -1 : 1;
    });
    result.push(...temp.map(entry => entry.entity));
    temp.length = 0;
}

/**
 * @param {Types.ResolvedSortBy[]} sortBy
 * @param {Types.SortingRules} sortingRules
 * @param {Types.FormattingRules} formattingRules
 * @param {Types.Data} data
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.Edition} edition
 * @returns {Types.ResolvedRow[]}
 */
export function getSortedRows(sortBy, sortingRules, formattingRules, data, rows, columns, edition) {
    if (sortBy.length === 0)
        return rows;

    if (sortingRules === null)
        return rows;

    const sortByLookup = getSortByLookup(sortBy, 'columnId', 'rowId');
    const columnLookup = new Map(columns.filter(row => row.type !== 'DYNAMIC-BLOCK').map(column => [column.key, column]));
    const sortedColumns = sortBy
        .map(cell => stringifyId(cell.columnId))
        .filter(key => columnLookup.has(key))
        .map(key => columnLookup.get(key))
        .reverse();

    if (sortedColumns.length === 0)
        return rows;

    for (const column of sortedColumns) {
        /** @type {Types.ResolvedRow[]} */
        const result = [];
        /** @type {TempSortingEntry<Types.ResolvedRow>[]} */
        const temp = [];

        for (const row of rows) {
            if (row.type === 'DYNAMIC-BLOCK') {
                flush(temp, result);
                result.push(row);
                continue;
            }

            const comparator = sortingRules.resolve(column, row, sortByLookup.get(column.key));

            if (!comparator) {
                flush(temp, result);
                result.push(row);
                continue;
            }

            const cell = formattingRules.resolve(data, rows, columns, row, column, edition);
            const entry = { entity: row, comparator, cell };

            if (temp.length === 0) {
                temp.push(entry);
                continue;
            }

            if (temp[0].comparator === comparator) {
                temp.push(entry);
                continue;
            }

            flush(temp, result);
            temp.push(entry);
        }

        flush(temp, result);
        rows = result;
    }

    return rows;
}

/**
 * @param {Types.ResolvedSortBy[]} sortBy
 * @param {Types.SortingRules} sortingRules
 * @param {Types.FormattingRules} formattingRules
 * @param {Types.Data} data
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.Edition} edition
 * @returns {Types.ResolvedColumn[]}
 */
export function getSortedColumns(sortBy, sortingRules, formattingRules, data, rows, columns, edition) {
    if (sortBy.length === 0)
        return columns;

    if (sortingRules === null)
        return columns;

    const sortByLookup = getSortByLookup(sortBy, 'rowId', 'columnId');
    const rowLookup = new Map(rows.filter(row => row.type != 'DYNAMIC-BLOCK').map(row => [row.key, row]));
    const sortedRows = sortBy
        .map(cell => stringifyId(cell.rowId))
        .filter(key => rowLookup.has(key))
        .map(key => rowLookup.get(key))
        .reverse();

    if (sortedRows.length === 0)
        return columns;

    for (const row of sortedRows) {
        /** @type {Types.ResolvedColumn[]} */
        const result = [];
        /** @type {TempSortingEntry<Types.ResolvedColumn>[]} */
        const temp = [];

        for (const column of columns) {
            if (column.type === 'DYNAMIC-BLOCK') {
                flush(temp, result);
                result.push(column);
                continue;
            }

            const comparator = sortingRules.resolve(column, row, sortByLookup.get(row.key));

            if (!comparator) {
                flush(temp, result);
                result.push(column);
                continue;
            }

            const cell = formattingRules.resolve(data, rows, columns, row, column, edition);
            const entry = { entity: column, comparator, cell };

            if (temp.length === 0) {
                temp.push(entry);
                continue;
            }

            if (temp[0].comparator === comparator) {
                temp.push(entry);
                continue;
            }

            flush(temp, result);
            temp.push(entry);
        }

        flush(temp, result);
        columns = result;
    }

    return columns;
}