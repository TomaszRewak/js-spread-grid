app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    formatting=[
        {
            "column": {"id": "score"},
            "value": "value / 100",
        },
        {
            "column": {"id": "score"},
            "condition": "value > 0.5",
            "style": {
                "background": "#a5d6a7",
            },
        },
    ],
)
