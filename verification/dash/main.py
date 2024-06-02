import dash
from dash_spread_grid import DashSpreadGrid

app = dash.Dash(__name__)

app.layout = DashSpreadGrid(
    data=[
        {"name": "John", "age": 25, "score": 100, "registered": True, "team": "red"},
        {"name": "Alice", "age": 24, "score": 70, "registered": False, "team": "blue"},
        {"name": "Bob", "age": 26, "score": 35, "registered": True, "team": "blue"},
        {"name": "Charlie", "age": 27, "score": 60, "registered": False, "team": "red"},
        {"name": "David", "age": 18, "score": 60, "registered": True, "team": "red"},
        {"name": "Eve", "age": 29, "score": 80, "registered": False, "team": "green"},
        {"name": "Frank", "age": 30, "score": 50, "registered": True, "team": "blue"},
    ],
    formatting=[
        {
            "text": 25,
        }
    ],
)

if __name__ == "__main__":
    app.run_server(port=8090)
