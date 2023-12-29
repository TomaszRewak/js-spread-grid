export default function getDataFormattingRules(formatting, dataSelector) {
    return [
        {
            column: { match: 'ANY' },
            row: { match: 'HEADER' },
            value: ({column}) => column.header
        },
        {
            column: { match: 'ANY' },
            row: { match: 'SEARCH' },
            value: ({newValue}) => newValue || '',
            text: ({newValue}) => newValue || 'Search...',
            edit: {
                validate: () => true,
                parse: ({ string }) => string,
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