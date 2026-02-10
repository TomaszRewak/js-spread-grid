app.layout = DashSpreadGrid(  # type: ignore
    # collapse: true
    data=data,
    formatting=[
        {"row": {"id": 25}, "style": {"background": "#cce5ff"}},
        {"column": {"id": "c25"}, "style": {"background": "#cce5ff"}},
    ],
    pinned_top=1,
    pinned_left=1,
    # collapse: false
    vertical_scroll_target={"index": 25},
    horizontal_scroll_target={"index": 25},
    vertical_scroll_speed="smooth",
    horizontal_scroll_speed="smooth",
)
