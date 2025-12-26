app.layout = DashSpreadGrid(  # type: ignore
    columns=[
        {"id": "HEADER", "type": "HEADER", "header": "HEADER", "width": "fit", "labels": []},
        {"id": "name", "selector": "name", "type": "DATA", "header": "name", "width": "fit", "labels": []},
        {"id": "age", "selector": "age", "type": "DATA", "header": "age", "width": "fit", "labels": []},
        {"id": "score", "selector": "score", "type": "DATA", "header": "score", "width": "fit", "labels": []},
        {"id": "registered", "selector": "registered", "type": "DATA", "header": "registered", "width": "fit", "labels": []},
        {"id": "team", "selector": "team", "type": "DATA", "header": "team", "width": "fit", "labels": []},
    ],
    rows=[
        {"id": 0, "selector": 0, "type": "DATA", "header": "0", "height": "fit", "labels": []},
        {"id": 1, "selector": 1, "type": "DATA", "header": "1", "height": "fit", "labels": []},
        {"id": 2, "selector": 2, "type": "DATA", "header": "2", "height": "fit", "labels": []},
        {"id": 3, "selector": 3, "type": "DATA", "header": "3", "height": "fit", "labels": []},
        {"id": 4, "selector": 4, "type": "DATA", "header": "4", "height": "fit", "labels": []},
        {"id": 5, "selector": 5, "type": "DATA", "header": "5", "height": "fit", "labels": []},
        {"id": 6, "selector": 6, "type": "DATA", "header": "6", "height": "fit", "labels": []},
    ],
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
)
