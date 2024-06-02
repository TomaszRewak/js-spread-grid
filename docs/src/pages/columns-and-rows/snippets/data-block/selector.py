app.layout = DashSpreadGrid(  # type: ignore
    data={
        "columns": 10,
        "rows": 10,
        "offset": 5,
    },
    columns=[
        {
            "type": "DATA-BLOCK",
            "selector": "Array.from({ length: data.columns }, (_, index) => index + 1)",
        },
    ],
    rows=[
        {
            "type": "DATA-BLOCK",
            "selector": "Array.from({ length: data.rows }, (_, index) => index + 1)",
        },
    ],
    dataSelector=lambda data, column, row: column["id"] * row["id"] + data["offset"],
)
