import dash_js_grid
from dash import Dash, callback, html, Input, Output

app = Dash(__name__)

columns_widths = [100, 80, 80, 111, 73, 173, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 30, 100]
rows_count = 2300

columns = [
    {'id': f'column_{i}', 'header': f'Column {i}', 'width': columns_widths[i]}
    for i in range(len(columns_widths))
]

rows = [
    {'id': i, 'height': 20}
    for i in range(rows_count)
]

data = [
    {
        f'column_{j}': i * len(columns) + j
        for j in range(len(columns))
    }
    for i in range(rows_count)
]

app.layout = html.Div([
    dash_js_grid.DashJsGrid(
        columnsLeft=columns[:2],
        columns=columns[2:-1],
        columnsRight=columns[-1:],
        rowsTop=[
            {'type': 'header', 'height': 20},
            *rows[:2],
            *rows[8:10],
            {'type': 'header', 'height': 20},
        ],
        rows=rows[2:-2],
        rowsBottom=[
            {'type': 'header', 'height': 20, 'fixed': 'bottom'},
            *rows[-2:],
            {'type': 'header', 'height': 20, 'fixed': 'bottom'},
        ],
        data=data,
        formatting=[],
    ),
    html.Div(style={'height': '10px'}),
])


# @callback(Output('output', 'children'), Input('input', 'value'))
# def display_output(value):
#     return 'You have entered {}'.format(value)


if __name__ == '__main__':
    app.run_server(debug=True)
