/** @import * as Types from "../typings.js"; */

import getPopupPosition from "../core-utils/getPopupPosition.js";
import stringifyId from "../core-utils/stringifyId.js";
import getDataFormatting from "../state-utils/getDataFormatting.js";
import getReducedFormatting from "../state-utils/getReducedFormatting.js";
import FormattingRules from "../types/FormattingRules.js";
import showError from "./error.js";

/** @type {(() => void) | null} */
let closeActiveMenu = null;

function addStyles() {
    if (document.getElementById('spread-grid-context-menu-style'))
        return;

    const style = document.createElement('style');
    style.id = 'spread-grid-context-menu-style';
    style.textContent = `
        :where(.spread-grid-context-menu) {
            position: fixed;
            z-index: 2147483647;
            box-sizing: border-box;
            width: max-content;
            max-width: 100vw;
            max-height: 100vh;
            overflow: auto;
            padding: 2px 0;
            border: 1px solid black;
            border-radius: 5px;
            background: white;
            color: black;
            font: 12px Calibri, sans-serif;
        }
        :where(.spread-grid-context-menu-item) {
            display: block;
            box-sizing: border-box;
            width: 100%;
            border: 0;
            border-radius: 0;
            padding: 3px 25px 3px 7px;
            background: transparent;
            color: inherit;
            font: inherit;
            text-align: left;
            overflow-wrap: anywhere;
            cursor: pointer;
        }
        :where(.spread-grid-context-menu-item:hover, .spread-grid-context-menu-item:focus-visible) {
            background: #eee;
            outline: none;
        }
        :where(.spread-grid-context-menu-item:disabled) {
            opacity: .3;
            cursor: default;
        }
        :where(.spread-grid-context-menu-separator) {
            border-top: 1px solid #ddd;
            margin: 2px 0;
        }
    `;

    document.head.appendChild(style);
}

/**
 * @param {Types.Context} context
 * @param {MouseEvent} event
 * @returns {boolean}
 */
export default function showContextMenu(context, event) {
    closeActiveMenu?.();

    const state = context.state;
    const options = state.options;

    if (!state.hoveredCell)
        return false;

    const cell = { ...state.hoveredCell };
    const row = state.rowLookup.get(stringifyId(cell.rowId));
    const column = state.columnLookup.get(stringifyId(cell.columnId));

    const formatting = getReducedFormatting(
        getDataFormatting(options.formatting, options.dataSelector, options.sortBy),
        ['value', 'text', 'contextMenu']);
    const rules = new FormattingRules(formatting);
    const entries = rules.resolve(options.data, state.rows, state.columns, row, column, state.edition).contextMenu || [];

    if (!entries.some(entry => entry !== 'separator'))
        return false;

    const onSelect = options.onContextMenuSelect;
    const previousFocus = document.activeElement;

    const menu = document.createElement('div');
    /** @type {HTMLButtonElement[]} */
    const buttons = [];

    const observer = new MutationObserver(() => {
        if (!context.element.isConnected || !menu.isConnected)
            close();
    });

    /** @param {boolean} [restoreFocus] */
    function close(restoreFocus = false) {
        menu.remove();
        observer.disconnect();

        document.removeEventListener('pointerdown', onPointerDown, true);
        document.removeEventListener('keydown', onKeyDown, true);
        document.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('blur', onResize);

        closeActiveMenu = null;

        if (restoreFocus && previousFocus instanceof HTMLElement && previousFocus.isConnected)
            previousFocus.focus({ preventScroll: true });
    }

    /** @param {PointerEvent} pointerEvent */
    function onPointerDown(pointerEvent) {
        if (!menu.contains(/** @type {Node} */(pointerEvent.target)))
            close();
    }

    /** @param {Event} scrollEvent */
    function onScroll(scrollEvent) {
        if (!menu.contains(/** @type {Node} */(scrollEvent.target)))
            close();
    }

    function onResize() {
        close();
    }

    /** @param {KeyboardEvent} keyEvent */
    function onKeyDown(keyEvent) {
        if (keyEvent.key === 'Escape') {
            keyEvent.preventDefault();
            keyEvent.stopPropagation();
            close(true);
            return;
        }

        if (keyEvent.key === 'Tab') {
            close();
            return;
        }

        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(keyEvent.key))
            return;

        keyEvent.preventDefault();
        keyEvent.stopPropagation();

        const enabled = buttons.filter(button => !button.disabled);
        if (!enabled.length)
            return;

        const current = enabled.indexOf(/** @type {HTMLButtonElement} */(document.activeElement));
        let next = current;

        if (keyEvent.key === 'Home')
            next = 0;
        if (keyEvent.key === 'End')
            next = enabled.length - 1;
        if (keyEvent.key === 'ArrowDown')
            next = (current + 1) % enabled.length;
        if (keyEvent.key === 'ArrowUp')
            next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;

        enabled[next].focus();
    }

    addStyles();

    menu.className = 'spread-grid-context-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', 'Cell actions');
    menu.tabIndex = -1;

    let separatorPending = false;

    for (const entry of entries) {
        if (entry === 'separator') {
            separatorPending = buttons.length > 0;
            continue;
        }

        if (separatorPending) {
            const separator = document.createElement('div');
            separator.className = 'spread-grid-context-menu-separator';
            separator.setAttribute('role', 'separator');
            menu.appendChild(separator);
            separatorPending = false;
        }

        const button = document.createElement('button');
        const id = entry.id;

        button.type = 'button';
        button.className = 'spread-grid-context-menu-item';
        if (entry.className)
            button.className += ` ${entry.className}`;

        button.setAttribute('role', 'menuitem');
        button.tabIndex = -1;
        button.disabled = !!entry.disabled;
        button.innerHTML = entry.content;

        button.addEventListener('click', () => {
            close(true);
            try {
                onSelect({ ...cell, id });
            } catch (error) {
                showError(context, error);
            }
        });

        buttons.push(button);
        menu.appendChild(button);
    }

    menu.addEventListener('contextmenu', menuEvent => menuEvent.preventDefault());

    context.tooltip.remove();
    menu.style.left = '0px';
    menu.style.top = '0px';
    document.body.appendChild(menu);

    const rect = menu.getBoundingClientRect();
    const viewport = document.documentElement;
    const left = getPopupPosition(event.clientX, rect.width, viewport.clientWidth, 2, 2);
    const top = getPopupPosition(event.clientY, rect.height, viewport.clientHeight, 2, 2);

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    (buttons.find(button => !button.disabled) || menu).focus({ preventScroll: true });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('blur', onResize);

    closeActiveMenu = close;

    return true;
}