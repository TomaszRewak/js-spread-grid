<SpreadGrid
    columns={[
        // collapse: true
        { id: 'label', width: 120 },
        { id: 'index', width: 60 },
        // collapse: false
    ]}
    rows={[
        { type: 'HEADER' },
        {
            type: 'DYNAMIC-BLOCK',
            count: 1000,
            selector: ({ index }) => index * 10,
            id: ({ selector }) => `item-${selector}`,
        },
    ]}
    dataSelector={({ row, column }) => {
        // collapse: true
        if (column.selector === 'label') return `Item at position ${row.selector}`;
        if (column.selector === 'index') return row.selector;
        // collapse: false
    }}
    pinnedTop={1}
/>
