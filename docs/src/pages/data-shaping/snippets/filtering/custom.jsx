<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    rows={[
        { type: 'HEADER' },
        { type: 'FILTER' },
        { type: 'DATA-BLOCK' }
    ]}
    // collapse: true
    columns={[{ type: 'DATA-BLOCK', width: 70 }]}
    // collapse: false
    filtering={[
        {
            column: [{ id: 'name' }],
            condition: ({ value, expression }) =>
                value.toLowerCase().startsWith(expression.toLowerCase())
        }
    ]}
/>