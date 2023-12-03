from dash import Dash
from pyppeteer import launch
import threading
import os
import sys
from pathlib import Path

def start_server(app, port):
    def run_server():
        app.run_server(host='localhost', port=port)

    thread = threading.Thread(target=run_server)
    thread.daemon = True
    thread.start()


async def start_browser():
    return await launch(executablePath='/usr/bin/google-chrome', args=['--no-sandbox'])


async def start_page(browser, port):
    page = await browser.newPage()
    await page.goto(f'http://localhost:{port}')
    return page


def get_target_file_path(extension):
    frame = sys._getframe(3)

    current_function_name = frame.f_code.co_name
    current_file = Path(frame.f_code.co_filename).stem
    current_folder = os.path.dirname(os.path.abspath(frame.f_code.co_filename))

    return os.path.join(current_folder, 'screenshots', f'{current_file}_{current_function_name}.{extension}')

async def wait_for_element(page, element_selector):
    await page.waitForSelector(element_selector, timeout=2_000)
    await page.waitFor(250)

async def get_element_rect(page, element_selector):
    return await page.evaluate(f'''(elementSelector) => {{
        const element = document.querySelector(elementSelector);
        const {{x, y, width, height}} = element.getBoundingClientRect();
        return {{x, y, width, height}};
    }}''', element_selector)


def expect_image(image):
    screenshot_path = get_target_file_path('png')
    screenshot_latest_path = get_target_file_path('latest.png')

    print(f'Writing screenshot to {screenshot_path}')
    print(f'Writing screenshot to {screenshot_latest_path}')

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


async def expect_dash_layout(layout, element_selector):
    app = Dash(__name__)
    app.layout = layout

    start_server(app, 8099)

    try:
        browser = await start_browser()
        page = await start_page(browser, 8099)

        await wait_for_element(page, element_selector)

        element_rect = await get_element_rect(page, element_selector)
        image = await page.screenshot(clip=element_rect)

        expect_image(image)
    finally:
        await browser.close()