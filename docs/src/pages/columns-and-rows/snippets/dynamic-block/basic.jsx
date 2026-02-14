<SpreadGrid
    columns={[
        // collapse: true
        { id: 'value', width: 80 },
        { id: 'square', width: 80 },
        { id: 'cube', width: 80 },
        // collapse: false
    ]}
    rows={[
        { type: 'HEADER' },
        { type: 'DYNAMIC-BLOCK', count: 100000 },
    ]}
    dataSelector={({ row, column }) => {
        const n = row.selector;
        if (column.selector === 'value') return n;
        if (column.selector === 'square') return n * n;
        if (column.selector === 'cube') return n * n * n;
    }}
    pinnedTop={1}
/>
