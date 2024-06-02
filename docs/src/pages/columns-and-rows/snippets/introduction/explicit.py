app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    columns=[
        {"id": "name"},
        {"type": "HEADER"},
        {"id": "age"},
        {"id": "score"},
        {"id": "registered"},
        {"id": "team"},
    ],
    rows=[
        {"type": "HEADER"},
        {"type": "FILTER"},
        {"id": 0},
        {"id": 1},
        {"id": 2},
        {"id": 3},
        {"id": 4},
        {"id": 5},
        {"id": 6},
        {"type": "HEADER", "id": "footer"},
    ],
)
