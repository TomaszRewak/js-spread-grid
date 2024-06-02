app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    formatting=[
        {
            "column": {"id": "score"},
            "text": "`${value}%`",
        },
        {
            "column": {"id": "registered"},
            "text": "''",
        },
        {
            "column": {"id": "registered"},
            "condition": "value",
            "text": "'✓'",
        },
    ],
)
