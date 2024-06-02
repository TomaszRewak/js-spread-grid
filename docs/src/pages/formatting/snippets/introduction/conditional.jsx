<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    formatting={[
        {
            column: { id: 'registered' },
            condition: ({ value }) => value,
            style: { background: '#a5d6a7' }
        },
        {
            column: { id: 'score' },
            condition: ({ value }) => value <= 50,
            style: { background: '#ffcdd2' }
        }
    ]}
/>