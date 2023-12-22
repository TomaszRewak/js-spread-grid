export default function getDataFormattingRules(formatting, dataSelector) {
    return [
        {
            column: { match: 'ANY' },
            row: { match: 'HEADER' },
            value: ({column}) => column.header
        },
        {
            column: { match: 'DATA' },
            row: { match: 'DATA' },
            value: dataSelector
        },
        ...formatting
    ];
}