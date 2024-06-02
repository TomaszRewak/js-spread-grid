<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    formatting={[
        {
            column: { id: 'score' },
            style: ({ value, row, data }) => ({
                background: value > 50 ? '#a5d6a7' : '#ffcdd2',
                foreground: value > 50 ? 'green' : 'red',
                textAlign: 'center',
                textBaseline: 'middle',
                borderTop: row.id > 0 && (value > 50 ^ data[row.id - 1].score > 50)
                    ? { width: 3, color: 'purple' }
                    : { width: 1, color: 'green' }
            })
        }
    ]}
/>