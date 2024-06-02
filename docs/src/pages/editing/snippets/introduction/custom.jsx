<SpreadGrid
    data={{
        // collapse: true
        // default dict data
        // collapse: false
    }}
    // collapse: true
    columns={[{ type: 'DATA-BLOCK', width: 70 }]}
    // collapse: false
    formatting={[
        {
            column: [{ id: 'age' }, { id: 'score' }],
            edit: {
                parse: ({ string }) => parseInt(string),
                validate: ({ string }) => !isNaN(parseInt(string)),
            }
        }
    ]}
/>