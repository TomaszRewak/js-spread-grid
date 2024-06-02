app.layout = DashSpreadGrid(  # type: ignore
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
    formatting=[
        {
            "style": "throw new Error('This is an error')",
        }
    ],
)
