SpreadGrid(div, {
    data: [
        // collapse: true
        // default data
        // collapse: false
    ],
    rows: [
        { type: 'HEADER' },
        {
            type: 'DATA-BLOCK',
            id: ({ data, selector }) => data[selector].name
        },
    ],
});