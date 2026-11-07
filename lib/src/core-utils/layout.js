/** @import * as Types from "../typings.js"; */

/** @type {Exclude<keyof Types.Layout, 'version'>[]} */
const fields = [
    'filters', 'sortBy', 'columnsOrder', 'rowsOrder', 'columnWidths', 'rowHeights',
    'hiddenColumns', 'hiddenRows', 'pinnedTop', 'pinnedBottom', 'pinnedLeft', 'pinnedRight'
];
const arrayFields = fields.slice(0, 8);
const pinFields = fields.slice(8);

/**
 * @param {Types.Context} context
 * @returns {Types.Layout}
 */
export function getLayout(context) {
    const options = context.state.options;
    return /** @type {Types.Layout} */ ({ version: 1, ...Object.fromEntries(fields.map(field => [field, options[field]])) });
}

/**
 * @param {string} text
 * @param {Types.Layout} current
 * @returns {Types.Layout}
 */
export function parseLayout(text, current) {
    const input = JSON.parse(text);
    if (!input || typeof input !== 'object' || Array.isArray(input))
        throw new Error('Layout must be a JSON object.');
    if ('version' in input && input.version !== 1)
        throw new Error('Unsupported layout version.');

    for (const field of Object.keys(input)) {
        if (field !== 'version' && !fields.includes(/** @type {any} */ (field)))
            throw new Error(`Unknown layout field: ${field}.`);
    }
    for (const field of arrayFields) {
        if (field in input && !Array.isArray(input[field]))
            throw new Error(`${field} must be an array.`);
    }
    for (const field of pinFields) {
        if (field in input && (!Number.isInteger(input[field]) || input[field] < 0))
            throw new Error(`${field} must be a nonnegative integer.`);
    }

    for (const entry of input.columnWidths || []) {
        if (!entry || typeof entry !== 'object' || !('columnId' in entry) || !Number.isFinite(entry.width) || entry.width <= 0)
            throw new Error('Each column width needs a columnId and a positive numeric width.');
    }
    for (const entry of input.rowHeights || []) {
        if (!entry || typeof entry !== 'object' || !('rowId' in entry) || !Number.isFinite(entry.height) || entry.height <= 0)
            throw new Error('Each row height needs a rowId and a positive numeric height.');
    }
    for (const entry of input.sortBy || []) {
        if (!entry || typeof entry !== 'object' || (!('columnId' in entry) && !('rowId' in entry)) || (entry.direction !== undefined && !['ASC', 'DESC'].includes(entry.direction)))
            throw new Error('Each sort entry needs a columnId or rowId; direction must be ASC or DESC when provided.');
    }
    for (const entry of input.filters || []) {
        if (!entry || typeof entry !== 'object' || (!('columnId' in entry) && !('rowId' in entry)) || !('expression' in entry))
            throw new Error('Each filter needs a columnId or rowId and an expression.');
    }

    return { ...current, ...input, version: 1 };
}

/**
 * @param {Types.Context} context
 * @param {Types.Layout} layout
 */
export function applyLayout(context, layout) {
    const options = context.state.options;
    Object.assign(context.localOptions, Object.fromEntries(fields.map(field => [field, layout[field]])));

    options.onFiltersChange(layout.filters);
    options.onSortByChange(layout.sortBy);
    options.onColumnsOrderChange(layout.columnsOrder);
    options.onRowsOrderChange(layout.rowsOrder);
    options.onColumnWidthsChange(layout.columnWidths);
    options.onRowHeightsChange(layout.rowHeights);
    options.onHiddenColumnsChange(layout.hiddenColumns);
    options.onHiddenRowsChange(layout.hiddenRows);
    options.onLayoutChange(layout);

    context.requestNewRender();
}