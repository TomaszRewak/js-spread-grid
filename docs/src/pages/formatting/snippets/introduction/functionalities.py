app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    formatting=[
        {
            "column": {"id": "registered"},
            "text": "value ? '✓' : '✗'",
            "style": """{
                background: value ? '#a5d6a7' : '#ffcdd2',
                foreground: value ? 'green' : 'red',
                textAlign: 'center'
            }""",
        },
        # collapse: true
        {
            "column": {"id": "team"},
            "style": "{foreground: value}",
        },
        {
            "column": {"id": "score"},
            "value": "value / 100",
            "text": "value.toFixed(2)",
        },
        {
            "row": {"id": 1},
            "style": {
                "background": "lightgray",
                "foreground": "gray",
            },
        },
        {
            "column": {"id": "age"},
            "edit": {
                "validate": "!isNaN(Number(string))",
                "parse": "Number(string)",
            },
            "style": {"textAlign": "right"},
        },
        # collapse: false
    ],
)
