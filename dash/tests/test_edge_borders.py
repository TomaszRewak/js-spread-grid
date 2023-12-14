import pytest
from dash_spread_grid import DashSpreadGrid

from tests.utils import expect_dash_layout

def border(color):
    return f'{{border: {{width: 1, color: "{color}"}}}}'

@pytest.mark.asyncio
async def test_top_rows_left_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_rows_middle_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_rows_right_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_rows_left_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_rows_middle_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_rows_right_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_bottom_rows_left_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_bottom_rows_middle_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_bottom_rows_right_columns():
    grid = DashSpreadGrid(
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

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_middle_rows_left_columns():
    grid = DashSpreadGrid(
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
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_middle_rows_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_middle_rows_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[],
        columnsRight=[
            {'id': 0, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_bottom_rows_left_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_bottom_rows_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_bottom_rows_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[],
        columnsRight=[
            {'id': 0, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_bottom_rows_left_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_bottom_rows_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_bottom_rows_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[],
        columnsRight=[
            {'id': 0, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_left_columns():
    grid = DashSpreadGrid(
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
        rowsBottom=[
            {'id': 2, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2'],
            ['test_3']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') },
            { 'row': {'id': 2}, 'column': {'id': 0}, 'style': border('green') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[
            {'id': 2, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2'],
            ['test_3']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') },
            { 'row': {'id': 2}, 'column': {'id': 0}, 'style': border('green') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[],
        columnsRight=[
            {'id': 0, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[
            {'id': 2, 'height': 20}
        ],
        data=[
            ['test_1'],
            ['test_2'],
            ['test_3']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('blue') },
            { 'row': {'id': 2}, 'column': {'id': 0}, 'style': border('green') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_rows_left_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[
            {'id': 1, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_rows_left_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[
            {'id': 1, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_bottom_rows_left_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[
            {'id': 1, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[],
        rows=[],
        rowsBottom=[
            {'id': 0, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_rows_left_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_rows_left_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_bottom_rows_left_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[],
        rows=[],
        rowsBottom=[
            {'id': 0, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_rows_middle_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_rows_middle_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_bottom_rows_middle_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[],
        rows=[],
        rowsBottom=[
            {'id': 0, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_middle_rows_left_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[
            {'id': 1, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_middle_rows_left_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_top_middle_rows_middle_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_bottom_rows_left_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[
            {'id': 1, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_bottom_rows_left_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_middle_bottom_rows_middle_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[],
        rows=[
            {'id': 0, 'height': 20}
        ],
        rowsBottom=[
            {'id': 1, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_left_middle_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[
            {'id': 1, 'width': 100}
        ],
        columnsRight=[],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[
            {'id': 2, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4'],
            ['test_5', 'test_6']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') },
            { 'row': {'id': 2}, 'column': {'id': 0}, 'style': border('orange') },
            { 'row': {'id': 2}, 'column': {'id': 1}, 'style': border('purple') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_left_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[
            {'id': 2, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4'],
            ['test_5', 'test_6']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') },
            { 'row': {'id': 2}, 'column': {'id': 0}, 'style': border('orange') },
            { 'row': {'id': 2}, 'column': {'id': 1}, 'style': border('purple') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_middle_right_columns():
    grid = DashSpreadGrid(
        columnsLeft=[],
        columns=[
            {'id': 0, 'width': 100}
        ],
        columnsRight=[
            {'id': 1, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[
            {'id': 2, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2'],
            ['test_3', 'test_4'],
            ['test_5', 'test_6']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('yellow') },
            { 'row': {'id': 2}, 'column': {'id': 0}, 'style': border('orange') },
            { 'row': {'id': 2}, 'column': {'id': 1}, 'style': border('purple') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_all_columns():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100}
        ],
        columns=[
            {'id': 1, 'width': 100}
        ],
        columnsRight=[
            {'id': 2, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20}
        ],
        rows=[
            {'id': 1, 'height': 20}
        ],
        rowsBottom=[
            {'id': 2, 'height': 20}
        ],
        data=[
            ['test_1', 'test_2', 'test_3'],
            ['test_4', 'test_5', 'test_6'],
            ['test_7', 'test_8', 'test_9']
        ],
        formatting=[
            { 'row': {'id': 0}, 'column': {'id': 0}, 'style': border('red') },
            { 'row': {'id': 0}, 'column': {'id': 1}, 'style': border('blue') },
            { 'row': {'id': 0}, 'column': {'id': 2}, 'style': border('green') },
            { 'row': {'id': 1}, 'column': {'id': 0}, 'style': border('yellow') },
            { 'row': {'id': 1}, 'column': {'id': 1}, 'style': border('orange') },
            { 'row': {'id': 1}, 'column': {'id': 2}, 'style': border('purple') },
            { 'row': {'id': 2}, 'column': {'id': 0}, 'style': border('pink') },
            { 'row': {'id': 2}, 'column': {'id': 1}, 'style': border('black') },
            { 'row': {'id': 2}, 'column': {'id': 2}, 'style': border('brown') }
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')

@pytest.mark.asyncio
async def test_all_rows_all_columns_big():
    grid = DashSpreadGrid(
        columnsLeft=[
            {'id': 0, 'width': 100},
            {'id': 1, 'width': 100},
            {'id': 2, 'width': 100}
        ],
        columns=[
            {'id': 3, 'width': 100},
            {'id': 4, 'width': 100},
            {'id': 5, 'width': 100}
        ],
        columnsRight=[
            {'id': 6, 'width': 100},
            {'id': 7, 'width': 100},
            {'id': 8, 'width': 100}
        ],
        rowsTop=[
            {'id': 0, 'height': 20},
            {'id': 1, 'height': 20},
            {'id': 2, 'height': 20}
        ],
        rows=[
            {'id': 3, 'height': 20},
            {'id': 4, 'height': 20},
            {'id': 5, 'height': 20}
        ],
        rowsBottom=[
            {'id': 6, 'height': 20},
            {'id': 7, 'height': 20},
            {'id': 8, 'height': 20}
        ],
        data=[
            ['red', 'red', 'red', 'blue', 'blue', 'blue', 'green', 'green', 'green'],
            ['red', 'red', 'red', 'blue', 'blue', 'blue', 'green', 'green', 'green'],
            ['red', 'red', 'red', 'blue', 'blue', 'blue', 'green', 'green', 'green'],
            ['yellow', 'yellow', 'yellow', 'orange', 'orange', 'orange', 'purple', 'purple', 'purple'],
            ['yellow', 'yellow', 'yellow', 'orange', 'orange', 'orange', 'purple', 'purple', 'purple'],
            ['yellow', 'yellow', 'yellow', 'orange', 'orange', 'orange', 'purple', 'purple', 'purple'],
            ['pink', 'pink', 'pink', 'black', 'black', 'black', 'brown', 'brown', 'brown'],
            ['pink', 'pink', 'pink', 'black', 'black', 'black', 'brown', 'brown', 'brown'],
            ['pink', 'pink', 'pink', 'black', 'black', 'black', 'brown', 'brown', 'brown']
        ],
        formatting=[
            { 'style': '{border: {width: 1, color: value}}' },
        ]
    )

    await expect_dash_layout(grid, 'div.spread-grid')