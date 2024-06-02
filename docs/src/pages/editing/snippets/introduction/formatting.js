SpreadGrid(div, {
    data: {
        // collapse: true
        // default dict data
        // collapse: false
    },
    // collapse: true
    columns: [{ type: 'DATA-BLOCK', width: 70 }],
    // collapse: false
    formatting: [
        {
            column: { id: 'score' },
            edit: {
                // collapse: true
                parse: ({ string }) => parseInt(string),
                validate: ({ string }) => !isNaN(parseInt(string)),
                // collapse: false
            }
        },
        {
            column: { id: 'score' },
            condition: context => 'newValue' in context,
            text: ({ value, newValue }) => `${value} → ${newValue}`,
            style: ({ value, newValue }) => value < newValue
                ? { background: '#8fe38f' }
                : { background: '#f07d7d' }
        }
    ],
});