app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    columns=[
        {"id": "name"},
        {"id": "age", "labels": ["numeric"], "width": 50},
        {"id": "score", "labels": ["numeric"], "width": 50},
        {"id": "registered"},
        {"id": "team"},
    ],
    formatting=[
        {
            "column": {"label": "numeric"},
            "style": {"textAlign": "right", "background": "#a5d6a7"},
        },
        {
            "column": {"id": "name"},
            "row": {"id": 1},
            "style": {"background": "#ffcdd2"},
        },
        {
            "row": {"type": "HEADER"},
            "style": {"foreground": "red"},
        },
    ],
)
