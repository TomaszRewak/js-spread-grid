@callback(
    Input("grid", "selected_context_menu_item"),
    prevent_initial_call=True,
)
def on_context_menu_select(selection):
    print(selection["id"], selection["columnId"], selection["rowId"])


app.layout = DashSpreadGrid(  # type: ignore
    # collapse: true
    id="grid",
    data=data,
    # collapse: false
    formatting=[
        {
            "row": {"type": "DATA"},
            "context_menu": {"id": "inspect", "content": "Inspect cell"},
        },
        {
            "row": {"type": "DATA"},
            "context_menu": """[
                'separator',
                {id: 'use-value', content: '<strong>Use value</strong>'},
                {
                    id: 'double',
                    content: typeof value === 'number' ? `Double ${value}` : 'Double number',
                    disabled: typeof value !== 'number'
                }
            ]""",
        },
    ],
)