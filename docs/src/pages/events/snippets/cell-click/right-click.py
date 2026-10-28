@callback(
    Input("grid", "clicked_cell"),
    prevent_initial_call=True,
)
def on_cell_click(clicked_cell):
    column_id = clicked_cell["columnId"]
    row_id = clicked_cell["rowId"]
    click = "Right" if clicked_cell["button"] == 2 else "Left"
    print(f"{click} click: {column_id}, {row_id}")


app.layout = DashSpreadGrid(
    id="grid",
    data={
        # collapse: true
        # default dict data
        # collapse: false
    },
    enable_right_click=True,
)