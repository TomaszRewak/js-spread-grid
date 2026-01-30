/** @import * as Types from "../typings.js"; */

/** @type {Types.Rule} */
const filterRule = {
    /** @type {Types.ValueFunction} */
    value: ({ newValue }) => newValue || '',
    text: ({ newValue }) => newValue || 'Search...', // TODO: Move to render formatting?
    edit: {
        validate: () => true,
        parse: ({ string }) => string,
        autoCommit: true
    }
};

/**
 * @param {Types.Rule[]} formatting
 * @param {Types.DataSelector} dataSelector
 * @param {Types.SortBy[]} sortBy
 * @returns {Types.Rule[]}
 */
export default function getDataFormatting(formatting, dataSelector, sortBy) {
    return [
        {
            column: { type: 'DATA' },
            row: { type: 'HEADER' },
            /** @type {Types.ValueFunction} */
            value: ({ column }) => column.header === undefined ? column.id : column.header
        },
        {
            column: { type: 'HEADER' },
            row: { type: 'DATA' },
            /** @type {Types.ValueFunction} */
            value: ({ row }) => row.header === undefined ? row.id : row.header
        },
        {
            column: { type: 'HEADER' },
            row: { type: 'SPECIAL' },
            value: ''
        },
        {
            column: { type: 'SPECIAL' },
            row: { type: 'HEADER' },
            value: ''
        },
        {
            column: { type: 'DATA' },
            row: { type: 'FILTER' },
            ...filterRule
        },
        {
            column: { type: 'FILTER' },
            row: { type: 'DATA' },
            ...filterRule
        },
        {
            column: { type: 'DATA' },
            row: { type: 'DATA' },
            value: dataSelector
        },
        ...formatting,
        // TODO: Fix headers of sorted rows
        ...sortBy.map(({ columnId, rowId, direction }, index) => ({
            column: { id: columnId },
            row: { id: rowId },
            text: /** @param {Types.FunctionContext} _ */ ({ value, text }) => `${sortBy.length > 1 ? index + 1 : ''}${direction === 'ASC' ? '⇣' : '⇡'} ${text || value}`
        })),
    ];
}