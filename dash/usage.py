import dash_spread_grid
from dash import Dash, callback, html, Input, Output
_dash_renderer._set_react_version("18.2.0")

app = Dash(__name__)

app.layout = html.Div([
    dash_spread_grid.DashSpreadGrid(
        id='input',
        data=[
            {"col_1": 1, "col_2": 2, "col_3": 3, "col_4": 4},
            {"col_1": 5, "col_2": 6, "col_3": 7, "col_4": 8},
            {"col_1": 9, "col_2": 10, "col_3": 11, "col_4": 12},
            {"col_1": 13, "col_2": 14, "col_3": 15, "col_4": 16}
        ],
        columns=[
            {"header": "Column 1", "id": "col_1", "width": 200},
            {"header": "Column 2", "id": "col_2", "width": 200},
            {"header": "Column 3", "id": "col_3", "width": 200},
            {"header": "Column 4", "id": "col_4", "width": 200},
        ],
        rows=[
            {"type": "HEADER", "height": 20},
            {"id": 0, "height": 20},
            {"id": 1, "height": 20},
            {"id": 2, "height": 20},
            {"id": 3, "height": 20},
        ],
    ),
    html.Div(id='output')
])


if __name__ == '__main__':
    app.run_server(debug=True)
