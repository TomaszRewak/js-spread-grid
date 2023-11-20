import dash_js_grid
from dash import Dash, callback, html, Input, Output

app = Dash(__name__)

app.layout = html.Div([
    dash_js_grid.DashJsGrid(
        columns=[
            {'id': 'column_1', 'header': 'Column 1', 'width': 100, 'fixed': 'left'},
            {'id': 'column_2', 'header': 'Column 2', 'width': 80, 'fixed': 'left'},
            {'id': 'column_3', 'header': 'Column 3', 'width': 80},
            {'id': 'column_4', 'header': 'Column 4', 'width': 111},
            {'id': 'column_5', 'header': 'Column 5', 'width': 73},
            {'id': 'column_6', 'header': 'Column 6', 'width': 30},
            {'id': 'column_7', 'header': 'Column 7', 'width': 100}
        ],
        rows=[
            {'type': 'header', 'height': 20, 'fixed': 'top'},
            {'id': 0, 'height': 20, 'fixed': 'top'},
            {'id': 1, 'height': 20, 'fixed': 'top'},
            {'id': 2, 'height': 20},
            {'id': 3, 'height': 20},
            {'id': 4, 'height': 20},
            {'id': 5, 'height': 20},
            {'id': 6, 'height': 20},
            {'id': 7, 'height': 20},
            {'id': 8, 'height': 20},
            {'id': 9, 'height': 20}
        ],
        data=[
            {'column_1': '1', 'column_2': '2', 'column_3': '3', 'column_4': '4', 'column_5': '5', 'column_6': '6', 'column_7': '7'},
            {'column_1': '11', 'column_2': '12', 'column_3': '13', 'column_4': '14', 'column_5': '15', 'column_6': '16', 'column_7': '17'},
            {'column_1': '21', 'column_2': '22', 'column_3': '23', 'column_4': '24', 'column_5': '25', 'column_6': '26', 'column_7': '27'},
            {'column_1': '31', 'column_2': '32', 'column_3': '33', 'column_4': '34', 'column_5': '35', 'column_6': '36', 'column_7': '37'},
            {'column_1': '41', 'column_2': '42', 'column_3': '43', 'column_4': '44', 'column_5': '45', 'column_6': '46', 'column_7': '47'},
            {'column_1': '51', 'column_2': '52', 'column_3': '53', 'column_4': '54', 'column_5': '55', 'column_6': '56', 'column_7': '57'},
            {'column_1': '61', 'column_2': '62', 'column_3': '63', 'column_4': '64', 'column_5': '65', 'column_6': '66', 'column_7': '67'},
            {'column_1': '71', 'column_2': '72', 'column_3': '73', 'column_4': '74', 'column_5': '75', 'column_6': '76', 'column_7': '77'},
            {'column_1': '81', 'column_2': '82', 'column_3': '83', 'column_4': '84', 'column_5': '85', 'column_6': '86', 'column_7': '87'},
            {'column_1': '91', 'column_2': '92', 'column_3': '93', 'column_4': '94', 'column_5': '95', 'column_6': '96', 'column_7': '97'},
        ],
        cellStyle=[
            {
                'column': {'id': 'column_5'},
                'style': '{background: "lightgreen"}'
            },
            {
                'row': {'index': 5},
                'style': '{background: "lightblue"}'
            },
            {
                'row': {'index': 5},
                'column': {'id': 'column_5'},
                'style': '{background: "lightcoral"}'
            },
            {
                'row': {'index': 4},
                'column': {'id': 'column_5'},
                'style': '{borderLeft: {width: 3}, borderTop: {width: 3}, borderRight: {width: 3}}'
            },
            {
                'row': {'index': 5},
                'column': {'id': 'column_4'},
                'style': '{borderLeft: {width: 3}, borderTop: {width: 3}, borderBottom: {width: 3}}'
            },
            {
                'row': {'index': 5},
                'column': {'id': 'column_6'},
                'style': '{borderTop: {width: 3}, borderBottom: {width: 3}, borderRight: {width: 3}}'
            },
            {
                'row': {'index': 6},
                'column': {'id': 'column_5'},
                'style': '{borderLeft: {width: 3}, borderRight: {width: 3}, borderBottom: {width: 3}}'
            },
            {
                'row': {'index': 10},
                'style': '{borderBottom: {width: 5}}'
            },
            {
                'column': {'index': 0},
                'style': '{borderLeft: {width: 5}}'
            },
            {
                'column': {'index': 6},
                'style': '{borderRight: {width: 5}}'
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
