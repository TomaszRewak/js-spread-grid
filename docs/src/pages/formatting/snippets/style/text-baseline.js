SpreadGrid(div, {
    data: [
        // collapse: true
        // default data
        // collapse: false
    ],
    rows: [
        { type: 'HEADER' },
        { type: 'DATA-BLOCK', height: 40 },
    ],
    formatting: [
        {
            column: { id: 'name' },
            style: { textBaseline: 'top' }
        },
        {
            column: { id: 'age' },
            style: { textBaseline: 'middle' }
        },
        {
            column: { id: 'score' },
            style: { textBaseline: 'bottom' }
        },
    ]
});