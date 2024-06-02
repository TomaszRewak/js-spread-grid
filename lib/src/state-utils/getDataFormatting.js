const filterRule = {
    value: ({ newValue }) => newValue || '',
    text: ({ newValue }) => newValue || 'Search...', // TODO: Move to render formatting?
    edit: {
        validate: () => true,
        parse: ({ string }) => string,
        autoCommit: true
    }
};

export default function getDataFormatting(formatting, dataSelector, sortBy) {
    return [
        {
            column: { type: 'DATA' },
            row: { type: 'HEADER' },
            value: ({ column }) => column.header === undefined ? column.id : column.header
        },
        {
            column: { type: 'HEADER' },
            row: { type: 'DATA' },
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
            text: ({ value, text }) => `${sortBy.length > 1 ? index + 1 : ''}${direction === 'ASC' ? '⇣' : '⇡'} ${text || value}`
        })),
    ];
}