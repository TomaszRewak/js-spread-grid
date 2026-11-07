/** @import * as Types from "../typings.js"; */

import { getLayout, parseLayout, applyLayout } from "../core-utils/layout.js";

/** @type {(() => void) | null} */
let closeActiveEditor = null;

const paths = {
    copy: '<rect x="7" y="7" width="10" height="10"/><path d="M13 7V3H3v10h4"/>',
    paste: '<path d="M7 4H4v13h12V4h-3"/><rect x="7" y="2" width="6" height="4"/>',
    apply: '<path d="M3 10l5 5 9-10"/>',
    close: '<path d="M4 4l12 12M16 4L4 16"/>'
};

/**
 * @param {keyof typeof paths} name
 * @returns {string}
 */
function getLayoutIcon(name) {
    return `<svg class="spread-grid-layout-icon" aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function addStyles() {
    if (document.getElementById('spread-grid-layout-editor-style'))
        return;

    const style = document.createElement('style');
    style.id = 'spread-grid-layout-editor-style';
    style.textContent = `
        :where(.spread-grid-layout-editor) {
            box-sizing: border-box; width: 640px; max-width: calc(100vw - 24px);
            max-height: calc(100vh - 24px); padding: 16px; border: 1px solid #555;
            border-radius: 4px; background: white; color: black; font: 13px Calibri, sans-serif;
        }
        :where(.spread-grid-layout-editor::backdrop) { background: #0005; }
        :where(.spread-grid-layout-editor-header, .spread-grid-layout-editor-actions) {
            display: flex; align-items: center; gap: 8px;
        }
        :where(.spread-grid-layout-editor-header) { justify-content: space-between; margin-bottom: 12px; }
        :where(.spread-grid-layout-editor-title) { font-size: 16px; font-weight: bold; }
        :where(.spread-grid-layout-editor textarea) {
            display: block; box-sizing: border-box; width: 100%; height: 320px; max-height: 50vh;
            padding: 8px; border: 1px solid #bbb; resize: vertical; font: 12px monospace;
            background: white; color: black;
        }
        :where(.spread-grid-layout-editor-actions) { justify-content: flex-end; flex-wrap: wrap; margin-top: 12px; }
        :where(.spread-grid-layout-editor button) {
            display: inline-flex; align-items: center; gap: 5px; padding: 5px 9px;
            border: 1px solid #bbb; border-radius: 2px; background: #f5f5f5; color: black;
            font: inherit; cursor: pointer;
        }
        :where(.spread-grid-layout-editor button:hover) { background: #eee; }
        :where(.spread-grid-layout-editor-status) { min-height: 18px; margin-top: 8px; overflow-wrap: anywhere; }
        :where(.spread-grid-layout-editor-status[data-error]) { color: #b00020; }
    `;
    document.head.appendChild(style);
}

/** @param {Types.Context} context */
export default function showLayoutEditor(context) {
    closeActiveEditor?.();
    addStyles();

    const dialog = document.createElement('dialog');
    const header = document.createElement('div');
    const title = document.createElement('div');
    const textarea = document.createElement('textarea');
    const status = document.createElement('div');
    const actions = document.createElement('div');
    const previousFocus = document.activeElement;

    dialog.className = 'spread-grid-layout-editor';
    dialog.setAttribute('aria-label', 'Edit layout');
    header.className = 'spread-grid-layout-editor-header';
    title.className = 'spread-grid-layout-editor-title';
    title.textContent = 'Edit layout';
    textarea.setAttribute('aria-label', 'Layout JSON');
    textarea.spellcheck = false;
    textarea.value = JSON.stringify(getLayout(context), null, 2);
    status.className = 'spread-grid-layout-editor-status';
    status.setAttribute('role', 'status');
    actions.className = 'spread-grid-layout-editor-actions';

    /** @param {string} message @param {boolean} [error] */
    function report(message, error = false) {
        status.textContent = message;
        status.toggleAttribute('data-error', error);
    }

    function close() {
        dialog.close();
        cleanup();
    }

    /**
    * @param {string} name
     * @param {Parameters<typeof getLayoutIcon>[0]} icon
     * @param {() => void | Promise<void>} action
     * @param {boolean} [iconOnly]
     */
    function makeButton(name, icon, action, iconOnly = false) {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = name;
        button.setAttribute('aria-label', name);
        button.innerHTML = getLayoutIcon(icon);
        if (!iconOnly)
            button.appendChild(document.createTextNode(name));
        button.addEventListener('click', () => {
            Promise.resolve().then(action).catch(error => report(error.message, true));
        });
        return button;
    }

    header.append(title, makeButton('Close', 'close', close, true));
    actions.append(
        makeButton('Copy', 'copy', async () => {
            try {
                await navigator.clipboard.writeText(textarea.value);
                report('Layout copied.');
            } catch {
                textarea.focus();
                textarea.select();
                report('Clipboard unavailable; the layout text is selected.');
            }
        }),
        makeButton('Paste', 'paste', async () => {
            try {
                textarea.value = await navigator.clipboard.readText();
                report('Layout pasted.');
            } catch {
                textarea.focus();
                report('Clipboard unavailable; paste directly into the layout field.');
            }
        }),
        makeButton('Cancel', 'close', close),
        makeButton('Apply', 'apply', () => {
            const layout = parseLayout(textarea.value, getLayout(context));
            applyLayout(context, layout);
            close();
        })
    );

    const observer = new MutationObserver(() => {
        if (!context.element.isConnected)
            close();
    });
    function cleanup() {
        if (!dialog.isConnected)
            return;
        observer.disconnect();
        dialog.remove();
        if (closeActiveEditor === close)
            closeActiveEditor = null;
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
            previousFocus.focus({ preventScroll: true });
    }
    dialog.addEventListener('close', cleanup);
    dialog.addEventListener('cancel', event => {
        event.preventDefault();
        close();
    });
    let pointerDownOutside = false;
    dialog.addEventListener('pointerdown', event => {
        const rect = dialog.getBoundingClientRect();
        pointerDownOutside = event.target === dialog &&
            (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
    });
    dialog.addEventListener('click', event => {
        if (event.target !== dialog || !pointerDownOutside)
            return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
            close();
    });

    dialog.append(header, textarea, status, actions);
    document.body.appendChild(dialog);
    observer.observe(document.body, { childList: true, subtree: true });
    dialog.showModal();
    textarea.focus();
    closeActiveEditor = close;
}