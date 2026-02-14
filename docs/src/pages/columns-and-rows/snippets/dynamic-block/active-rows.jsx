<SpreadGrid
    columns={[
        // collapse: true
        { id: 'value', width: 80 },
        { id: 'doubled', width: 80 },
        // collapse: false
    ]}
    rows={[
        { type: 'HEADER' },
        { type: 'DYNAMIC-BLOCK', count: 100000 },
    ]}
    dataSelector={({ row, column }) => {
        // collapse: true
        const n = row.selector;
        if (column.selector === 'value') return n;
        if (column.selector === 'doubled') return n * 2;
        // collapse: false
    }}
    pinnedTop={1}
    onActiveRowsChange={(activeRows) => { /* update displayed list */ }}
/>
