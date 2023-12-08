import pytest
from dash_js_grid import DashJsGrid

from tests.utils import expect_dash_layout

def border(color):
    return f'{{border: {{width: 1, color: "{color}"}}}}'

@pytest.mark.asyncio
async def test_top_rows_left_columns():
    grid = DashJsGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_top_rows_middle_columns():
    grid = DashJsGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_top_rows_right_columns():
    grid = DashJsGrid(
        columnsLeft=[],
        columns=[],
        columnsRight=[
            {'id': 0, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_middle_rows_left_columns():
    grid = DashJsGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_middle_rows_middle_columns():
    grid = DashJsGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_middle_rows_right_columns():
    grid = DashJsGrid(
        columnsLeft=[],
        columns=[],
        columnsRight=[
            {'id': 0, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_bottom_rows_left_columns():
    grid = DashJsGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[],
        rowsTop=[],
        rows=[],
        rowsBottom=[
            {'id': 0, 'height': 20}
        ],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_bottom_rows_middle_columns():
    grid = DashJsGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[],
        rows=[],
        rowsBottom=[
            {'id': 0, 'height': 20}
        ],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_bottom_rows_right_columns():
    grid = DashJsGrid(
        columnsLeft=[],
        columns=[],
        columnsRight=[
            {'id': 0, 'width': 100}
        ],
        rowsTop=[],
        rows=[],
        rowsBottom=[
            {'id': 0, 'height': 20}
        ],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')

@pytest.mark.asyncio
async def test_top_middle_rows_left_columns():
    grid = DashJsGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.dash-js-grid')
