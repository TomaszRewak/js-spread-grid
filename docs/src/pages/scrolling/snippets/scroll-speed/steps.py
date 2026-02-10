app.layout = DashSpreadGrid(  # type: ignore
    # collapse: true
    data=data,
    formatting=[{"row": {"id": 100}, "style": {"background": "#cce5ff"}}],
    pinned_top=1,
    # collapse: false
    vertical_scroll_target={"index": 100},
    vertical_scroll_speed=[
        {"scrollSpeed": 200, "maxDistance": 500},
        {"scrollSpeed": 1000, "maxDistance": 2000},
        {"scrollSpeed": "smooth", "maxDistance": float("inf")},
    ],
)
