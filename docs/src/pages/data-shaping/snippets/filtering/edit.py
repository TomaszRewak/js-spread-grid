app.layout = DashSpreadGrid(  # type: ignore
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
    rows=[
        {"type": "HEADER"},
        {"type": "FILTER"},
        {"type": "DATA-BLOCK"},
    ],
    # collapse: true
    columns=[{"type": "DATA-BLOCK", "width": 70}],
    # collapse: false
    formatting=[
        {
            "column": [{"id": "age"}, {"id": "score"}],
            "row": [{"type": "FILTER"}],
            "edit": {
                "parse": "parseInt(string)",
                "validate": "!isNaN(parseInt(string))",
            },
        }
    ],
    filtering=[
        {
            "column": [{"id": "age"}, {"id": "score"}],
            "condition": "value >= expression",
        }
    ],
)
