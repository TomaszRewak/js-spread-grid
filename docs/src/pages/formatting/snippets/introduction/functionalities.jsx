<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    formatting={[
        {
            column: { id: 'registered' },
            text: ({ value }) => value ? '✓' : '✗',
            style: ({ value }) => ({
                background: value ? '#a5d6a7' : '#ffcdd2',
                foreground: value ? 'green' : 'red',
                textAlign: 'center'
            })
        },
        // collapse: true
        {
            column: { id: 'team' },
            style: ({ value }) => ({
                foreground: value
            })
        },
        {
            column: { id: 'score' },
            value: ({ value }) => value / 100,
            text: ({ value }) => `${value.toFixed(2)}`,
        },
        {
            row: { id: 1 },
            style: {
                background: 'lightgray',
                foreground: 'gray'
            }
        },
        {
            column: { id: 'age' },
            edit: {
                validate: ({ string }) => !isNaN(Number(string)),
                parse: ({ string }) => Number(string),
            },
            style: { textAlign: 'right' }
        }
        // collapse: false
    ]}
/>