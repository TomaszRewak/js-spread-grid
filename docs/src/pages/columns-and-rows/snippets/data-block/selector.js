SpreadGrid(div, {
    data: {
        columns: 10,
        rows: 10,
        offset: 5
    },
    columns: [
        {
            type: 'DATA-BLOCK',
            selector: data => Array.from({ length: data.columns }, (_, index) => index + 1)
        },
    ],
    rows: [
        {
            type: 'DATA-BLOCK',
            selector: data => Array.from({ length: data.rows }, (_, index) => index + 1)
        },
    ],
    dataSelector: ({ data, column, row }) => column.selector * row.selector + data.offset,
});