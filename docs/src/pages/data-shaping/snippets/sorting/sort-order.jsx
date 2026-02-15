<SpreadGrid
    data={[
        // collapse: true
        { name: 'John', age: 25, score: 100, registered: true, team: 'red' },
        { name: 'Alice', age: 24, score: -70, registered: false, team: 'blue' },
        { name: 'Bob', age: 26, score: 35, registered: true, team: 'blue' },
        { name: 'Charlie', age: 27, score: -60, registered: false, team: 'red' },
        { name: 'David', age: 18, score: 60, registered: true, team: 'red' },
        { name: 'Eve', age: 29, score: 80, registered: false, team: 'green' },
        { name: 'Frank', age: 30, score: -50, registered: true, team: 'blue' }
        // collapse: false
    ]}
    // collapse: true
    columns={[{ type: 'DATA-BLOCK', width: 70 }]}
    // collapse: false
    formatting={[
        {
            column: { id: "age" },
            row: { type: "HEADER" },
            sortOrder: ['ASC', null],
        },
        {
            column: { id: "score" },
            row: { type: "HEADER" },
            sortOrder: ['ASC', 'DESC'],
        },
        {
            column: { id: "registered" },
            row: { type: "HEADER" },
            sortOrder: [],
        }
    ]}
/>
