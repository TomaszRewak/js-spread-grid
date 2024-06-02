@callback(
    Input("grid", "clicked_cell"),
)
def on_cell_click(clicked_cell):
    column_id = clicked_cell["columnId"]
    row_id = clicked_cell["rowId"]

    # ...


app.layout = DashSpreadGrid(  # type: ignore
    id="grid",
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
)
