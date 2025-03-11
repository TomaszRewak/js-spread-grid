app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    formatting=[
        {
            # collapse: true
            "column": {"id": "score"},
            # collapse: false
            "tooltip": "value > 50 ? 'Good score' : 'Bad score'",
        }
    ],
)
