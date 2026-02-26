app.layout = DashSpreadGrid(  # type: ignore
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
    freeze_on_hover=True,
    sort_by=[{"columnId": "age", "direction": "ASC"}],
)
