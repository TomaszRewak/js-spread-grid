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
            "text": "{`${value.toFixed(2)}`}",
        },
        {
            "column": {"id": "score"},
            "style": "{background: value > 0.5 ? '#a5d6a7' : '#ffcdd2'}",
        },
    ],
)
