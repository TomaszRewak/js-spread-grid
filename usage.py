import dash_js_grid
from dash import Dash, callback, html, Input, Output

app = Dash(__name__)

app.layout = html.Div([
    dash_js_grid.DashJsGrid(
        # columns=['column_1', 'column_2', 'column_3', 'column_4', 'column_5'],
        data=[
            {'column_1': '1', 'column_2': '2', 'column_3': '3', 'column_4': '4', 'column_5': '5'},
            {'column_1': '11', 'column_2': '12', 'column_3': '13', 'column_4': '14', 'column_5': '15'},
            {'column_1': '21', 'column_2': '22', 'column_3': '23', 'column_4': '24', 'column_5': '25'},
            {'column_1': '31', 'column_2': '32', 'column_3': '33', 'column_4': '34', 'column_5': '35'},
            {'column_1': '41', 'column_2': '42', 'column_3': '43', 'column_4': '44', 'column_5': '45'},
        ],
        fixedColumns=2,
        fixedRows=2,
        # cellStyle=[
        #     {
        #         # {match: ANY | TOP | BOTTOM | LEFT | RIGHT | HEADER}
        #         # {id: any | any[]}
        #         # {index: number | number[]}
        #         'column': {'match': 'ANY'},
        #         'row': {'match': 'ANY'},
                
        #     }
        # ],
    ),
    html.Div(style={'height': '10px'}),
])


# @callback(Output('output', 'children'), Input('input', 'value'))
# def display_output(value):
#     return 'You have entered {}'.format(value)


if __name__ == '__main__':
    app.run_server(debug=True)
