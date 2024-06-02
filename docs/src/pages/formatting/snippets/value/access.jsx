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
        },
        {
            column: { id: 'score' },
            style: ({ value }) => ({
                background: value > 0.5 ? '#a5d6a7' : '#ffcdd2'
            })
        }
    ]}
/>