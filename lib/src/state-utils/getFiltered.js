import stringifyId from "../core-utils/stringifyId.js";

function getFilterLookup(filters, primaryKey, secondaryKey) {
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

export function getFilteredRows(filters, filteringRules, formattingRules, data, rows, columns, edition) {
    if (filters.length === 0)
        return rows;

    const filterLookup = getFilterLookup(filters, 'columnId', 'rowId');
    const filteredColumns = columns.filter(column => column.type !== 'FILTER' && filterLookup.has(column.key));

    if (filteredColumns.length === 0)
        return rows;

    return rows.filter(row => {
        for (const column of filteredColumns) {
            const cell = formattingRules.resolve(data, rows, columns, row, column, edition);
            const columnFilters = filterLookup.get(column.key);
            const visible = filteringRules.resolve(data, rows, columns, row, column, cell.value, cell.text, columnFilters);

            if (!visible)
                return false;
        }
        return true;
    });
}

export function getFilteredColumns(filters, filteringRules, formattingRules, data, rows, columns, edition) {
    if (filters.length === 0)
        return columns;

    const filterLookup = getFilterLookup(filters, 'rowId', 'columnId');
    const filteredRows = rows.filter(row => row.type !== 'FILTER' && filterLookup.has(row.key));

    if (filteredRows.length === 0)
        return columns;

    return columns.filter(column => {
        for (const row of filteredRows) {
            const cell = formattingRules.resolve(data, rows, columns, row, column, edition);
            const rowFilters = filterLookup.get(row.key);
            const visible = filteringRules.resolve(data, rows, columns, row, column, cell.value, cell.text, rowFilters);

            if (!visible)
                return false;
        }
        return true;
    });
}