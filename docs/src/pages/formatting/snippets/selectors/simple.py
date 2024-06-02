app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    columns=[
        {"id": "name"},
        {"id": "age", "labels": ["number"]},
        {"id": "score", "labels": ["number"]},
        {"id": "registered"},
        {"id": "team"},
    ],
    formatting=[
        {
            "column": {"id": "age"},
            "row": {"type": "ANY"},
            "style": {
                "background": "#e0f7fa",
                "foreground": "#00796b",
            },
        },
        {
            "column": {"label": "number"},
            "font": "8px Consolas",
            "style": {
                "textAlign": "right",
            },
        },
    ],
)
