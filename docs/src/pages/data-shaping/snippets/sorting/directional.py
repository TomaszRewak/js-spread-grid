app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        { "name": 'John', "age": 25, "score": 100, "registered": True, "team": 'red' },
        { "name": 'Alice', "age": 24, "score": -70, "registered": False, "team": 'blue' },
        { "name": 'Bob', "age": 26, "score": 35, "registered": True, "team": 'blue' },
        { "name": 'Charlie', "age": 27, "score": -60, "registered": False, "team": 'red' },
        { "name": 'David', "age": 18, "score": 60, "registered": True, "team": 'red' },
        { "name": 'Eve', "age": 29, "score": 80, "registered": False, "team": 'green' },
        { "name": 'Frank', "age": 30, "score": -50, "registered": True, "team": 'blue' }
        # collapse: false
    ],
    # collapse: true
    columns=[{"type": 'DATA-BLOCK', "width": 70}],
    # collapse: false
    sorting=[
        {
            "column": {"id": "score"},
            "comparator_asc": "Math.abs(lhs.value) < Math.abs(rhs.value)",
            "comparator_desc": "lhs.value < rhs.value"
        }
    ]
)
