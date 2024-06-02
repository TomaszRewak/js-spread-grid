app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    columns=[
        {"type": "DATA-BLOCK", "width": 80},
    ],
    formatting=[
        {
            "column": {"id": "name"},
            "style": {"textAlign": "left"},
        },
        {
            "column": {"id": "age"},
            "style": {"textAlign": "center"},
        },
        {
            "column": {"id": "score"},
            "style": {"textAlign": "right"},
        },
    ],
)