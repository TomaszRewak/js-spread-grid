<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    columns={[
        { id: 'name', width: 'fit' },
        { id: 'age', width: 100 },
        { id: 'score' },
        { id: 'registered', width: 100 },
        { id: 'team', width: 'fit-data' }
    ]}
    rows={[
        { type: 'HEADER', height: 50 },
        { id: 0 },
        { id: 1, height: 5 },
        { id: 2, height: 'fit-data' },
        { id: 3 },
        { id: 4 },
        { id: 5, height: 50 },
        { id: 6 }
    ]}
/>