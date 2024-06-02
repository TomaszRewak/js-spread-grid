<SpreadGrid
    columns={[
        { id: { side: 'left', property: 'name' }, header: '① Name' },
        { id: { side: 'left', property: 'age' }, header: '① Age' },
        // collapse: true
        { id: { side: 'left', property: 'score' }, header: '① Score' },
        { id: { side: 'left', property: 'registered' }, header: '① Registered' },
        { id: { side: 'right', property: 'name' }, header: '② Name' },
        { id: { side: 'right', property: 'age' }, header: '② Age' },
        { id: { side: 'right', property: 'score' }, header: '② Score' },
        { id: { side: 'right', property: 'registered' }, header: '② Registered' }
        // collapse: false
    ]}
    rows={[
        { type: 'HEADER' },
        { id: { left: 'John', right: 'John' } },
        { id: { left: 'John', right: 'Alice' } },
        // collapse: true
        { id: { left: 'John', right: 'Bob' } },
        { id: { left: 'John', right: 'Charlie' } },
        { id: { left: 'John', right: 'David' } },
        { id: { left: 'Alice', right: 'John' } },
        { id: { left: 'Alice', right: 'Alice' } },
        { id: { left: 'Alice', right: 'Bob' } },
        { id: { left: 'Alice', right: 'Charlie' } },
        { id: { left: 'Alice', right: 'David' } },
        { id: { left: 'Bob', right: 'John' } },
        { id: { left: 'Bob', right: 'Alice' } },
        { id: { left: 'Bob', right: 'Bob' } },
        { id: { left: 'Bob', right: 'Charlie' } },
        { id: { left: 'Bob', right: 'David' } },
        { id: { left: 'Charlie', right: 'John' } },
        { id: { left: 'Charlie', right: 'Alice' } },
        { id: { left: 'Charlie', right: 'Bob' } },
        { id: { left: 'Charlie', right: 'Charlie' } },
        { id: { left: 'Charlie', right: 'David' } },
        { id: { left: 'David', right: 'John' } },
        { id: { left: 'David', right: 'Alice' } },
        { id: { left: 'David', right: 'Bob' } },
        { id: { left: 'David', right: 'Charlie' } },
        { id: { left: 'David', right: 'David' } }
        // collapse: false
    ]}
    data={{
        John: { name: 'John', age: 25, score: 100, registered: true },
        Alice: { name: 'Alice', age: 24, score: 70, registered: false },
        // collapse: true
        Bob: { name: 'Bob', age: 26, score: 35, registered: true },
        Charlie: { name: 'Charlie', age: 27, score: 60, registered: false },
        David: { name: 'David', age: 18, score: 60, registered: true }
        // collapse: false
    }}
    dataSelector={({ data, row, column }) => data[row.id[column.id.side]][column.id.property]}
/>