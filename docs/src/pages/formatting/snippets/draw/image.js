SpreadGrid(div, {
    columns: [
        // collapse: true
        { type: 'HEADER' },
        { id: 'image', width: 100 }
        // collapse: false
    ],
    rows: [
        // collapse: true
        { type: 'HEADER' },
        { id: 0, height: 100 },
        { id: 1, height: 50 },
        { id: 2, height: 100 },
        { id: 3, height: 50 },
        // collapse: false
    ],
    formatting: [
        {
            column: { id: 'image' },
            draw: ({ ctx, column, row }) => {
                ctx.drawImage(image, 0, 0, column.width, row.height);
            }
        }
    ]
});