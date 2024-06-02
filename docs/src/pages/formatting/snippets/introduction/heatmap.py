app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    formatting=[
        {
            "column": {"id": "score"},
            "style": "{'background': `hsl(${value * 1}, 100%, 50%)`}",
        }
    ],
)
