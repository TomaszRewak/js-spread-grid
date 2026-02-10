app.layout = DashSpreadGrid(  # type: ignore
    # collapse: true
    data=data,
    formatting=[{"row": {"id": 100}, "style": {"background": "#cce5ff"}}],
    pinned_top=1,
    vertical_scroll_target={"index": 100},
    vertical_scroll_speed=500,
    # collapse: false
    disable_scroll_on_hover=True,
)
