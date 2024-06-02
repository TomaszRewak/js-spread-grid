app.layout = DashSpreadGrid(  # type: ignore
    data=[
        # collapse: true
        # default data
        # collapse: false
    ],
    formatting=[
        {
            "column": {"id": "score"},
            "draw": """
                const width = column.width - 4;
                const height = row.height - 4;
                const barWidth = width * (value / 100);

                ctx.fillStyle = '#76a9ea';
                ctx.fillRect(2, 2, barWidth, height);
            """,
        }
    ],
)
