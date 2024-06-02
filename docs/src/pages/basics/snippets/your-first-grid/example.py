import dash
from dash_spread_grid import DashSpreadGrid  # type: ignore

app = dash.Dash(__name__)

app.layout = DashSpreadGrid(
    data=[
        # default data
    ]
)

if __name__ == "__main__":
    app.run_server()
