import pytest
from dash_spread_grid import DashSpreadGrid

from tests.utils import expect_dash_layout


@pytest.mark.asyncio
async def test_text_alignment_left_top():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_left_middle():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_left_bottom():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_center_top():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_center_middle():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_center_bottom():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_right_top():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_right_middle():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')


@pytest.mark.asyncio
async def test_text_alignment_right_bottom():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')
