SpreadGrid(div, {
    data: [
        // collapse: true
        // default data
        // collapse: false
    ],
    rows: [
        { type: 'HEADER' },
        { type: 'FILTER' },
        { type: 'DATA-BLOCK' }
    ],
    // collapse: true
    columns: [{ type: 'DATA-BLOCK', width: 70 }],
    // collapse: false
    formatting: [
        {
            column: [{ id: 'name' }],
            row: [{ type: 'FILTER' }],
            text: ({ newValue }) => newValue || 'e.g. John'
        }
    ]
});