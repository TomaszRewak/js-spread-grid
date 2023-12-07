import pytest
from dash_js_grid import DashJsGrid

from tests.utils import expect_dash_layout

@pytest.mark.asyncio
async def test_grid():
    grid = DashJsGrid(
        columns=[
            {"id": "col1", "HEADER": "Column 1", "width": 100},
            {"id": "col2", "HEADER": "Column 2", "width": 100},
            {"id": "col3", "HEADER": "Column 3", "width": 100}
        ],
        rows=[
            {'type': 'HEADER', 'height': 20, 'fixed': 'top'},
            {"id": 0, "height": 20},
            {"id": 1, "height": 20},
            {"id": 2, "height": 20}
        ],
        data=[
            {"col1": "1", "col2": "2", "col3": "3"},
            {"col1": "4", "col2": "5", "col3": "6"},
            {"col1": "7", "col2": "8", "col3": "9"}
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')
