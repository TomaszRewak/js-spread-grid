app.layout = DashSpreadGrid(  # type: ignore
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
    columns=[
        {"type": "HEADER", "width": 30},
        {"type": "DATA-BLOCK", "width": 30},
    ],
)
