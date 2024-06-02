app.layout = DashSpreadGrid(  # type: ignore
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
    # collapse: true
    columns=[{"type": "DATA-BLOCK", "width": 70}],
    # collapse: false
    formatting=[
        {
            "column": [{"id": "age"}, {"id": "score"}],
            "edit": {
                "parse": "parseInt(string)",
                "validate": "!isNaN(parseInt(string))",
            },
        }
    ],
)
