app.layout = DashSpreadGrid(  # type: ignore
    data={
        "Alice": { "name": "Alice", "age": 24, "score": 70, "registered": False, "team": "blue" },
        "Bob": { "name": "Bob", "age": 26, "score": 35, "registered": True, "team": "blue" },
        "Charlie": { "name": "Charlie", "age": 27, "score": 60, "registered": False, "team": "red" },
        "David": { "name": "David", "age": 18, "score": 60, "registered": True, "team": "red" },
        "John": { "name": "John", "age": 25, "score": 100, "registered": True, "team": "red" },
    }
)