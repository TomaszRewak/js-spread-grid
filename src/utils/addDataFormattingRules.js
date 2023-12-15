export default function addDataFormattingRules(formatting, dataSelector) {
    return [
        {
            column: { match: 'ANY' },
            row: { match: 'HEADER' },
            value: (data, rows, columns, row, column, value) => column.header
        },
        {
            column: { match: 'DATA' },
            row: { match: 'DATA' },
            value: dataSelector
        },
        ...formatting
    ];
}