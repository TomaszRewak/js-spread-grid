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
            "column": {"id": "score"},
            "edit": {
                # collapse: true
                "parse": "parseInt(string)",
                "validate": "!isNaN(parseInt(string))",
                # collapse: false
            },
        },
        {
            "column": {"id": "score"},
            "condition": "newValue",
            "text": "({ value, newValue }) => `${value} → ${newValue}`",
            "style": "{ background: value < newValue ? '#8fe38f' : '#f07d7d'}",
        },
    ],
)
