data = [
    { name: 'John', age: 25, score: 100, registered: true, team: 'red' },
    { name: 'Alice', age: 24, score: 70, registered: false, team: 'blue' },
    { name: 'Bob', age: 26, score: 35, registered: true, team: 'blue' },
    { name: 'Charlie', age: 27, score: 60, registered: false, team: 'red' },
    { name: 'David', age: 18, score: 60, registered: true, team: 'red' },
];

// shift data

SpreadGrid(div, {
    data: data,
    rows: [
        { type: 'HEADER' },
        { id: data[0].name, selector: 0 },
        { id: data[1].name, selector: 1 },
        { id: data[2].name, selector: 2 },
        { id: data[3].name, selector: 3 },
        { id: data[4].name, selector: 4 },
    ]
});