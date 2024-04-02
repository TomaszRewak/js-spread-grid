export default function getDataFormatting(formatting, dataSelector, sortBy) {
    return [
        {
            column: { match: 'DATA' },
            row: { match: 'HEADER' },
            value: ({ column }) => column.header || column.id
        },
        {
            column: { match: 'HEADER' },
            row: { match: 'DATA' },
            value: ({ row }) => row.header || row.id
        },
        {
            column: { match: 'HEADER' },
            row: { match: 'SPECIAL' },
            value: ''
        },
        {
            column: { match: 'SPECIAL' },
            row: { match: 'HEADER' },
            value: ''
        },
        ...sortBy.map(({ columnId, rowId, direction }, index) => ({
            column: { id: columnId },
            row: { id: rowId },
            text: ({ column }) => `${sortBy.length > 1 ? index + 1 : ''}${direction === 'ASC' ? '⇣' : '⇡'} ${column.header}`
        })),
        {
            column: { match: 'ANY' },
            row: { match: 'FILTER' },
            value: ({ newValue }) => newValue || '',
            text: ({ newValue }) => newValue || 'Search...', // TODO: Move to render formatting?
            edit: {
                validate: () => true,
                parse: ({ string }) => string,
                autoCommit: true
            },
        },
        {
            column: { match: 'DATA' },
            row: { match: 'DATA' },
            value: dataSelector
        },
        ...formatting
    ];
}