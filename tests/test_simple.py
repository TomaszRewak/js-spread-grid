import pytest
from dash_js_grid import DashJsGrid
from dash import Dash
from pyppeteer import launch
import threading
import os
import sys
from pathlib import Path
from dash import html

@pytest.mark.asyncio
async def test_grid():
    grid = DashJsGrid(
        columns=[
            {"id": "col1", "header": "Column 1", "width": 100},
            {"id": "col2", "header": "Column 2", "width": 100},
            {"id": "col3", "header": "Column 3", "width": 100}
        ],
        rows=[
            {'type': 'header', 'height': 20, 'fixed': 'top'},
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

    app = Dash(__name__)
    app.layout = grid

    def run_server():
        app.run_server(host='localhost', port=8099)

    # Run server in a background thread
    thread = threading.Thread(target=run_server)
    thread.daemon = True
    thread.start()

    browser = await launch(executablePath='/usr/bin/google-chrome', args=['--no-sandbox'])
    page = await browser.newPage()
    await page.goto('http://localhost:8099')

    current_folder = os.path.dirname(os.path.abspath(__file__))
    current_file = Path(__file__).stem
    current_function_name = sys._getframe().f_code.co_name
    screenshot_path = os.path.join(current_folder, 'screenshots', f'{current_file}_{current_function_name}.png')
    screenshot_latest_path = os.path.join(current_folder, 'screenshots', f'{current_file}_{current_function_name}.latest.png')

    await page.waitForSelector('div.dash-js-grid', timeout=2_000)
    await page.waitFor(250)

    element_rect = await page.evaluate('''() => {
        const element = document.querySelector('div.dash-js-grid');
        const {x, y, width, height} = element.getBoundingClientRect();
        return {x, y, width, height};
    }''')

    image = await page.screenshot(clip=element_rect)

    os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)

    if not os.path.exists(screenshot_path):
        with open(screenshot_path, 'wb') as f:
            f.write(image)
    else:
        with open(screenshot_latest_path, 'wb') as f:
            f.write(image)

        with open(screenshot_path, 'rb') as f:
            expected_image = f.read()
        assert expected_image == image

    await browser.close()


