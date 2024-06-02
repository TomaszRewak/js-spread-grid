app.layout = DashSpreadGrid(  # type: ignore
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
    # collapse: true
    columns=[{"type": "DATA-BLOCK", "width": 70}],
    # collapse: false
    rows=[
        {"type": "HEADER"},
        {"id": 0},
        {"id": 1},
        {"id": 2},
        {"id": 3},
        {"type": "CUSTOM"},
        {"id": 4},
        {"id": 5},
        {"id": 6},
    ],
)
