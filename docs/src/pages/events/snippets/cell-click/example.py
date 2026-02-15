@callback(
    Input("grid", "clicked_cell"),
)
def on_cell_click(clicked_cell):
    column_id = clicked_cell["columnId"]
    row_id = clicked_cell["rowId"]
    ctrl_key = clicked_cell["ctrlKey"]
    shift_key = clicked_cell["shiftKey"]
    button = clicked_cell["button"]
    buttons = clicked_cell["buttons"]
    detail = clicked_cell["detail"]

    # ...


app.layout = DashSpreadGrid(  # type: ignore
    id="grid",
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
)
