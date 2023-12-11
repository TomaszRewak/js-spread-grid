import pytest
from dash_js_grid import DashJsGrid

from tests.utils import expect_dash_layout


@pytest.mark.asyncio
async def test_text_alignment_left_top():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'left', 'textBaseline': 'top' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_left_middle():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'left', 'textBaseline': 'middle' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_left_bottom():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'left', 'textBaseline': 'bottom' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_center_top():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'center', 'textBaseline': 'top' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_center_middle():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'center', 'textBaseline': 'middle' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_center_bottom():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'center', 'textBaseline': 'bottom' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_right_top():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'right', 'textBaseline': 'top' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_right_middle():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'right', 'textBaseline': 'middle' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')


@pytest.mark.asyncio
async def test_text_alignment_right_bottom():
    grid = DashJsGrid(
        columns=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 50},
            {'id': 1, 'height': 50},
            {'id': 2, 'height': 50}
        ],
        data=[
            ['', '', ''],
            ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
            ['', '', '']
        ],
        formatting=[
            { 'style': { 'textAlign': 'right', 'textBaseline': 'bottom' } }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')
