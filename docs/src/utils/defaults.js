const defaultData = [
    { name: 'John', age: 25, score: 100, registered: true, team: 'red' },
    { name: 'Alice', age: 24, score: 70, registered: false, team: 'blue' },
    { name: 'Bob', age: 26, score: 35, registered: true, team: 'blue' },
    { name: 'Charlie', age: 27, score: 60, registered: false, team: 'red' },
    { name: 'David', age: 18, score: 60, registered: true, team: 'red' },
    { name: 'Eve', age: 29, score: 80, registered: false, team: 'green' },
    { name: 'Frank', age: 30, score: 50, registered: true, team: 'blue' }
];

const defaultDataCode = {
    'js': [
        '{ name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
        '{ name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
        '{ name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
        '{ name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
        '{ name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
        '{ name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
        '{ name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }'
    ],
    'jsx': [
        '{ name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
        '{ name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
        '{ name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
        '{ name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
        '{ name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
        '{ name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
        '{ name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }'
    ],
    'py': [
        '{"name": "John", "age": 25, "score": 100, "registered": True, "team": "red"},',
        '{"name": "Alice", "age": 24, "score": 70, "registered": False, "team": "blue"},',
        '{"name": "Bob", "age": 26, "score": 35, "registered": True, "team": "blue"},',
        '{"name": "Charlie", "age": 27, "score": 60, "registered": False, "team": "red"},',
        '{"name": "David", "age": 18, "score": 60, "registered": True, "team": "red"},',
        '{"name": "Eve", "age": 29, "score": 80, "registered": False, "team": "green"},',
        '{"name": "Frank", "age": 30, "score": 50, "registered": True, "team": "blue"}'
    ]
};

const defaultDictData = {
    'John': { name: 'John', age: 25, score: 100, registered: true, team: 'red' },
    'Alice': { name: 'Alice', age: 24, score: 70, registered: false, team: 'blue' },
    'Bob': { name: 'Bob', age: 26, score: 35, registered: true, team: 'blue' },
    'Charlie': { name: 'Charlie', age: 27, score: 60, registered: false, team: 'red' },
    'David': { name: 'David', age: 18, score: 60, registered: true, team: 'red' },
    'Eve': { name: 'Eve', age: 29, score: 80, registered: false, team: 'green' },
    'Frank': { name: 'Frank', age: 30, score: 50, registered: true, team: 'blue' }
}

const defaultDictDataCode = {
    'js': [
        'John: { name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
        'Alice: { name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
        'Bob: { name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
        'Charlie: { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
        'David: { name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
        'Eve: { name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
        'Frank: { name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }'
    ],
    'jsx': [
        'John: { name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
        'Alice: { name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
        'Bob: { name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
        'Charlie: { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
        'David: { name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
        'Eve: { name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
        'Frank: { name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }'
    ],
    'py': [
        '"John": {"name": "John", "age": 25, "score": 100, "registered": True, "team": "red"},',
        '"Alice": {"name": "Alice", "age": 24, "score": 70, "registered": False, "team": "blue"},',
        '"Bob": {"name": "Bob", "age": 26, "score": 35, "registered": True, "team": "blue"},',
        '"Charlie": {"name": "Charlie", "age": 27, "score": 60, "registered": False, "team": "red"},',
        '"David": {"name": "David", "age": 18, "score": 60, "registered": True, "team": "red"},',
        '"Eve": {"name": "Eve", "age": 29, "score": 80, "registered": False, "team": "green"},',
        '"Frank": {"name": "Frank", "age": 30, "score": 50, "registered": True, "team": "blue"}'
    ]
};

const incompleteData = [
    { name: 'John', age: 25, score: 100 },
    { name: 'Alice', score: 70, registered: false },
    { name: 'Bob', age: 26, team: 'blue' },
    { name: 'Charlie', age: 27, score: 60, registered: false, team: 'red' },
    { name: 'David', registered: true, team: 'red' },
    { name: 'Eve', age: 29, team: 'green' },
    { name: 'Frank', age: 30, score: 50 }
];

const incompleteDataCode = {
    'js': [
        '    { name: \'John\', age: 25, score: 100 },',
        '    { name: \'Alice\', score: 70, registered: false },',
        '    { name: \'Bob\', age: 26, team: \'blue\' },',
        '    { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
        '    { name: \'David\', registered: true, team: \'red\' },',
        '    { name: \'Eve\', age: 29, team: \'green\' },',
        '    { name: \'Frank\', age: 30, score: 50 }'
    ],
    'jsx': [
        '    { name: \'John\', age: 25, score: 100 },',
        '    { name: \'Alice\', score: 70, registered: false },',
        '    { name: \'Bob\', age: 26, team: \'blue\' },',
        '    { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
        '    { name: \'David\', registered: true, team: \'red\' },',
        '    { name: \'Eve\', age: 29, team: \'green\' },',
        '    { name: \'Frank\', age: 30, score: 50 }'
    ],
    'py': [
        '    {"name": "John", "age": 25, "score": 100},',
        '    {"name": "Alice", "score": 70, "registered": false},',
        '    {"name": "Bob", "age": 26, "team": "blue"},',
        '    {"name": "Charlie", "age": 27, "score": 60, "registered": false, "team": "red"},',
        '    {"name": "David", "registered": true, "team": "red"},',
        '    {"name": "Eve", "age": 29, "team": "green"},',
        '    {"name": "Frank", "age": 30, "score": 50}'
    ]
};

export { defaultData, defaultDataCode, incompleteData, incompleteDataCode, defaultDictData, defaultDictDataCode };