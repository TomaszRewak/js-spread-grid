<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    formatting={[
        {
            column: { id: 'score' },
            value: ({ value }) => value / 100
        },
        {
            column: { id: 'score' },
            text: ({ value }) => `${value.toFixed(2)}`
        }
    ]}
/>