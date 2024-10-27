/** @type {Rule} */
const filterRule = {
    /** @type {ValueFunction} */
    value: ({ newValue }) => newValue || '',
    text: ({ newValue }) => newValue || 'Search...', // TODO: Move to render formatting?
    edit: {
        validate: () => true,
        parse: ({ string }) => string,
        autoCommit: true
    }
};

/**
 * @param {Rule[]} formatting
 * @param {DataSelector} dataSelector
 * @param {SortBy[]} sortBy
 * @returns {Rule[]}
 */
export default function getDataFormatting(formatting, dataSelector, sortBy) {
    return [
        {
            column: { type: 'DATA' },
            row: { type: 'HEADER' },
            /** @type {ValueFunction} */
            value: ({ column }) => column.header === undefined ? column.id : column.header
        },
        {
            column: { type: 'HEADER' },
            row: { type: 'DATA' },
            /** @type {ValueFunction} */
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
            text: /** @param {FunctionContext} _ */ ({ value, text }) => `${sortBy.length > 1 ? index + 1 : ''}${direction === 'ASC' ? '⇣' : '⇡'} ${text || value}`
        })),
    ];
}