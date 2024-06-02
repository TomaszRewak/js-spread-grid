<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    formatting={[
        {
            column: { id: 'score' },
            text: ({ value }) => `${value}%`
        },
        {
            column: { id: 'registered' },
            text: ''
        },
        {
            column: { id: 'registered' },
            condition: ({ value }) => value,
            text: '✓'
        }
    ]}
/>