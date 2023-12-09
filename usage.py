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

app.layout = html.Div(style={'maxHeight': '80vh', 'display': 'flex'}, children=[
    dash_js_grid.DashJsGrid(
        columnsLeft=columns[:2],
        columns=columns[2:-1],
        columnsRight=columns[-1:],
        rowsTop=[
            {'type': 'HEADER', 'height': 20},
            *rows[:2],
            {'id': 100, 'height': 7},
            {'id': 101, 'height': 70},
            {'id': 102, 'height': 70},
            {'id': 103, 'height': 70},
            *rows[8:10],
            {'type': 'HEADER', 'height': 20},
        ],
        rows=rows[2:-2],
        rowsBottom=[
            {'type': 'HEADER', 'height': 20},
            *rows[-2:],
            {'type': 'HEADER', 'height': 20},
        ],
        data=data,
        formatting=[
            {
                'column': {'id': 'column_5'},
                'style': '{background: "lightgreen"}'
            },
            {
                'row': {'id': 6},
                'style': '{background: "lightblue"}'
            },
            {
                'row': {'id': 6},
                'column': {'id': 'column_5'},
                'style': '{background: "lightcoral"}'
            },
            {
                'row': {'id': 5},
                'column': {'id': 'column_5'},
                'style': '{borderLeft: {width: 3}, borderTop: {width: 3}, borderRight: {width: 3}}'
            },
            {
                'row': {'id': 6},
                'column': {'id': 'column_4'},
                'style': '{borderLeft: {width: 3}, borderTop: {width: 3}, borderBottom: {width: 3}}'
            },
            {
                'row': {'id': 6},
                'column': {'id': 'column_6'},
                'style': '{borderTop: {width: 3}, borderBottom: {width: 3}, borderRight: {width: 3}}'
            },
            {
                'row': {'id': 7},
                'column': {'id': 'column_5'},
                'style': '{borderLeft: {width: 3}, borderRight: {width: 3}, borderBottom: {width: 3}}'
            },
            {
                'column': {'index': 0},
                'style': '{borderLeft: {width: 5}}'
            },
            {
                'column': {'index': 1},
                'style': '{borderRight: {width: 5, color: "red"}, background: "lightgrey"}'
            },
            {
                'column': {'index': 6},
                'style': '{borderLeft: {width: 5, dash: [15, 15]}, borderRight: {width: 5, dash: [15, 15]}, background: "lightgrey"}'
            },{
                'condition': 'value < 70',
                'value': '"small [jjj]"'
            },
            {
                'condition': 'value < 100',
                'value': '"SMALL"'
            },
            {
                'row': {'id': 20},
                'value': '"ABCDEFGHIJKLMNOPQRSTUVXYZ"'
            },
            {
                'column': {'id': 'column_5'},
                'style': '{textAlign: "right"}'
            },
            {
                'column': {'id': 'column_3'},
                'style': '{textAlign: "center", textBaseline: "bottom"}'
            },
            {
                'row': {'id': 101},
                'style': '{textBaseline: "top"}'
            },
            {
                'row': {'id': 102},
                'style': '{textBaseline: "middle"}'
            },
            {
                'row': {'id': 103},
                'style': '{textBaseline: "bottom"}'
            }
        ],
    ),
    html.Div(style={'height': '10px'}),
])


# @callback(Output('output', 'children'), Input('input', 'value'))
# def display_output(value):
#     return 'You have entered {}'.format(value)


if __name__ == '__main__':
    app.run_server(debug=True)
