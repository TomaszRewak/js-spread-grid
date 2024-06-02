app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    formatting=[
        {
            "column": {"id": "age"},
            "style": {"background": "#a5d6a7", "foreground": "#ff4081"},
        },
        {
            "row": {"id": 1},
            "style": {"background": "#ffcdd2"},
        },
    ],
)
