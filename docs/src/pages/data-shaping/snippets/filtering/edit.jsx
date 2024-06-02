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
    formatting={[
        {
            column: [{ id: 'age' }, { id: 'score' }],
            row: [{ type: 'FILTER' }],
            edit: {
                parse: ({ string }) => parseInt(string),
                validate: ({ string }) => !isNaN(parseInt(string))
            }
        }
    ]}
    filtering={[
        {
            column: [{ id: 'age' }, { id: 'score' }],
            condition: ({ value, expression }) => value >= expression
        }
    ]}
/>