<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    formatting={[
        {
            column: { id: 'score' },
            style: ({ value }) => ({
                background: `hsl(${value * 1}, 100%, 50%)`
            })
        }
    ]}
/>