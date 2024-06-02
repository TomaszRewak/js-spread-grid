<SpreadGrid
    columns={[
        { type: 'HEADER' },
        { id: 1 },
        { id: 2 },
        // collapse: true
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 }
        // collapse: false
    ]}
    rows={[
        { type: 'HEADER' },
        { id: 1 },
        { id: 2 },
        // collapse: true
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 }
        // collapse: false
    ]}
    dataSelector={({ row, column }) => row.id * column.id}
/>