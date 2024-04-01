export default function getDataFormatting(formatting, dataSelector, sortBy) {
    return [
        {
            column: { match: 'ANY' },
            row: { match: 'HEADER' },
            value: ({column}) => column.header
        },
        {
            column: { match: 'ANY' },
            row: { match: 'HEADER' },
            text: ({column}) => column.header
        },
        ...sortBy.map(({columnId, rowId, direction}) => ({
            column: { id: columnId },
            row: { id: rowId },
            text: ({column}) => `${direction === 'ASC' ? '⇣' : '⇡'} ${column.header}`
        })),
        {
            column: { match: 'ANY' },
            row: { match: 'FILTER' },
            value: ({newValue}) => newValue || '',
            text: ({newValue}) => newValue || 'Search...', // TODO: Move to render formatting?
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