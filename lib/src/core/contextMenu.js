/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";
import getDataFormatting from "../state-utils/getDataFormatting.js";
import getReducedFormatting from "../state-utils/getReducedFormatting.js";
import FormattingRules from "../types/FormattingRules.js";
import showError from "./error.js";
import showLayoutEditor from "./layoutEditor.js";

/** @type {(() => void) | null} */
let closeActiveMenu = null;

const paths = {
    hide: '<ellipse cx="10" cy="10" rx="8" ry="5"/><path d="M3 3l14 14"/>',
    show: '<ellipse cx="10" cy="10" rx="8" ry="5"/><circle cx="10" cy="10" r="2"/>',
    layout: '<rect x="3" y="3" width="14" height="14"/><path d="M3 8h14M8 3v14"/>',
    submenu: '<path d="M7 4l6 6-6 6"/>'
};

/**
 * @param {keyof typeof paths} name
 * @returns {string}
 */
function getLayoutIcon(name) {
    return `<svg class="spread-grid-layout-icon" aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

/**
 * @param {number} cursor
 * @param {number} size
 * @param {number} viewportSize
 * @param {number} marginBefore
 * @param {number} marginAfter
 * @returns {number}
 */
function getPopupPosition(cursor, size, viewportSize, marginBefore, marginAfter) {
    const position = cursor + marginAfter;
    if (position >= 0 && position + size <= viewportSize)
        return position;

    const flipped = cursor - size - marginBefore;
    if (flipped >= 0 && flipped + size <= viewportSize)
        return flipped;

    return Math.max(0, viewportSize - size);
}

/**
 * @param {Types.Context} context
 * @param {Types.PlacedRow} row
 * @param {Types.PlacedColumn} column
 * @returns {Types.ContextMenuEntry[]}
 */
function getLayoutContextMenu(context, row, column) {
    const { state } = context;
    if (!state.options.enableLayoutManagementContextMenu || (row.type !== 'HEADER' && column.type !== 'HEADER'))
        return [];

    /** @type {Types.ContextMenuEntry[]} */
    const entries = [];
    if (row.type === 'HEADER')
        entries.push(...getDimensionContextMenu(context, column, true));
    if (column.type === 'HEADER')
        entries.push(...getDimensionContextMenu(context, row, false));
    entries.push({
        content: `${getLayoutIcon('layout')}Edit layout`,
        onSelect: () => showLayoutEditor(context)
    }, 'separator');

    return entries;
}

/**
 * @param {Types.Context} context
 * @param {Types.PlacedColumn | Types.PlacedRow} dimension
 * @param {boolean} isColumn
 * @returns {Types.ContextMenuEntry[]}
 */
function getDimensionContextMenu(context, dimension, isColumn) {
    const { state } = context;
    const dimensions = isColumn ? state.unfilteredColumns : state.unfilteredRows;
    const hidden = isColumn ? state.options.hiddenColumns : state.options.hiddenRows;
    const axis = isColumn ? 'column' : 'row';
    const explicitDimensions = dimensions.filter(entry => entry.type !== 'DYNAMIC-BLOCK');
    const canHide = explicitDimensions.some(entry => entry.key === dimension.key);
    const changeHidden = isColumn ? state.options.onHiddenColumnsChange : state.options.onHiddenRowsChange;
    const getHidden = () => isColumn ? context.state.options.hiddenColumns : context.state.options.hiddenRows;

    const submenu = hidden.map(id => {
        const entry = explicitDimensions.find(entry => entry.key === stringifyId(id));
        const label = document.createElement('span');
        label.textContent = String(entry?.header || id);
        return {
            content: label.innerHTML,
            label: label.textContent,
            onSelect: () => changeHidden(getHidden().filter(hiddenId => stringifyId(hiddenId) !== stringifyId(id)))
        };
    }).sort((first, second) => first.label.localeCompare(second.label));

    /** @type {Types.ContextMenuEntry[]} */
    const entries = [];
    if (canHide) {
        const id = dimension.id;
        entries.push({
            content: `${getLayoutIcon('hide')}Hide ${axis}`,
            disabled: (isColumn ? state.shapedColumns : state.shapedRows).length === 1,
            onSelect: () => {
                const ids = getHidden();
                if (!ids.some(hiddenId => stringifyId(hiddenId) === stringifyId(id)))
                    changeHidden([...ids, id]);
            }
        });
    }
    entries.push({
        content: `${getLayoutIcon('show')}Show ${axis}`,
        disabled: !submenu.length,
        submenu
    });

    return entries;
}

/**
 * @param {Types.ContextMenuEntry[]} entries
 * @returns {Types.ContextMenuEntry[]}
 */
function snapshotEntries(entries) {
    return entries.map(entry => entry === 'separator' ? entry : {
        ...entry,
        submenu: entry.submenu ? snapshotEntries(entry.submenu) : undefined
    });
}

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
            position: relative;
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
        :where(.spread-grid-layout-icon) { flex: 0 0 14px; }
        :where(.spread-grid-context-menu-item > .spread-grid-layout-icon) {
            vertical-align: middle; margin-right: 6px;
        }
        :where(.spread-grid-context-menu-arrow) {
            display: flex;
            position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
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
    const customEntries = rules.resolve(options.data, state.rows, state.columns, row, column, state.edition).contextMenu || [];
    const entries = snapshotEntries(getLayoutContextMenu(context, row, column).concat(customEntries));

    if (!entries.some(entry => entry !== 'separator'))
        return false;

    const onSelect = options.onContextMenuSelect;
    const previousFocus = document.activeElement;

    const menu = document.createElement('div');
    /** @type {{element: HTMLDivElement, buttons: HTMLButtonElement[], parent: HTMLButtonElement | null}[]} */
    const levels = [];
    /** @type {Map<HTMLButtonElement, () => void>} */
    const openSubmenus = new Map();

    const observer = new MutationObserver(() => {
        if (!context.element.isConnected || !menu.isConnected)
            close();
    });

    /** @param {boolean} [restoreFocus] */
    function close(restoreFocus = false) {
        observer.disconnect();
        closeLevels(0);

        document.removeEventListener('pointerdown', onPointerDown, true);
        document.removeEventListener('keydown', onKeyDown, true);
        document.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('blur', onBlur);

        closeActiveMenu = null;

        if (restoreFocus && previousFocus instanceof HTMLElement && previousFocus.isConnected)
            previousFocus.focus({ preventScroll: true });
    }

    /** @param {PointerEvent} pointerEvent */
    function onPointerDown(pointerEvent) {
        if (!levels.some(level => level.element.contains(/** @type {Node} */(pointerEvent.target))))
            close();
    }

    /** @param {Event} scrollEvent */
    function onScroll(scrollEvent) {
        if (scrollEvent.target instanceof Element && scrollEvent.target.closest('.spread-grid'))
            return;
        if (!levels.some(level => level.element.contains(/** @type {Node} */(scrollEvent.target))))
            close();
    }

    function onBlur() {
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

        if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(keyEvent.key))
            return;

        keyEvent.preventDefault();
        keyEvent.stopPropagation();

        const focused = /** @type {HTMLButtonElement} */ (document.activeElement);
        const level = levels.find(level => level.element.contains(focused)) || levels[levels.length - 1];
        if (!level)
            return;

        if (keyEvent.key === 'ArrowRight') {
            openSubmenus.get(focused)?.();
            const child = levels[levels.indexOf(level) + 1];
            child?.buttons.find(button => !button.disabled)?.focus({ preventScroll: true });
            return;
        }
        if (keyEvent.key === 'ArrowLeft') {
            if (level.parent) {
                closeLevels(levels.indexOf(level));
                level.parent.focus({ preventScroll: true });
            }
            return;
        }

        const enabled = level.buttons.filter(button => !button.disabled);
        if (!enabled.length)
            return;

        const current = enabled.indexOf(focused);
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

    /** @param {number} depth */
    function closeLevels(depth) {
        for (const level of levels.splice(depth)) {
            level.parent?.setAttribute('aria-expanded', 'false');
            for (const button of level.buttons)
                openSubmenus.delete(button);
            level.element.remove();
        }
    }

    /**
     * @param {Types.ContextMenuEntry[]} items
     * @param {HTMLDivElement} element
     * @param {HTMLButtonElement | null} parent
     */
    function buildMenu(items, element, parent = null) {
        const depth = levels.length;
        /** @type {HTMLButtonElement[]} */
        const buttons = [];
        levels.push({ element, buttons, parent });

        element.className = 'spread-grid-context-menu';
        element.setAttribute('role', 'menu');
        element.setAttribute('aria-label', parent?.textContent || 'Cell actions');
        element.tabIndex = -1;
        element.addEventListener('contextmenu', menuEvent => menuEvent.preventDefault());

        let separatorPending = false;
        for (const entry of items) {
            if (entry === 'separator') {
                separatorPending = buttons.length > 0;
                continue;
            }

            if (separatorPending) {
                const separator = document.createElement('div');
                separator.className = 'spread-grid-context-menu-separator';
                separator.setAttribute('role', 'separator');
                element.appendChild(separator);
                separatorPending = false;
            }

            const button = document.createElement('button');
            const id = entry.id;
            const action = entry.onSelect || onSelect;
            const submenu = entry.submenu;

            button.type = 'button';
            button.className = 'spread-grid-context-menu-item';
            if (entry.className)
                button.className += ` ${entry.className}`;
            button.setAttribute('role', 'menuitem');
            button.tabIndex = -1;
            button.disabled = !!entry.disabled;
            button.innerHTML = entry.content;

            function openSubmenu() {
                if (button.disabled || !submenu?.length)
                    return;
                if (levels[depth + 1]?.parent === button)
                    return;

                closeLevels(depth + 1);
                const child = document.createElement('div');
                buildMenu(submenu, child, button);
                child.style.left = '0px';
                child.style.top = '0px';
                document.body.appendChild(child);

                const rect = child.getBoundingClientRect();
                const anchor = button.getBoundingClientRect();
                const parentRect = element.getBoundingClientRect();
                const viewport = document.documentElement;
                const gap = 2;
                const firstButton = levels[depth + 1].buttons[0];
                const inset = firstButton ? firstButton.getBoundingClientRect().top - rect.top : 0;
                const left = parentRect.right + gap + rect.width <= viewport.clientWidth
                    ? parentRect.right + gap
                    : Math.max(0, parentRect.left - gap - rect.width);
                const top = getPopupPosition(anchor.top - inset, rect.height, viewport.clientHeight, 0, 0);

                child.style.left = `${left}px`;
                child.style.top = `${top}px`;
                button.setAttribute('aria-expanded', 'true');
            }

            if (submenu?.length) {
                const arrow = document.createElement('span');
                arrow.className = 'spread-grid-context-menu-arrow';
                arrow.innerHTML = getLayoutIcon('submenu');
                button.appendChild(arrow);
                button.setAttribute('aria-haspopup', 'menu');
                button.setAttribute('aria-expanded', 'false');
                openSubmenus.set(button, openSubmenu);
            }

            button.addEventListener('pointerenter', () => {
                if (submenu?.length && !button.disabled)
                    openSubmenu();
                else
                    closeLevels(depth + 1);
            });
            button.addEventListener('focus', () => {
                if (levels[depth + 1]?.parent !== button)
                    closeLevels(depth + 1);
            });
            button.addEventListener('click', () => {
                if (button.disabled)
                    return;
                if (submenu?.length) {
                    openSubmenu();
                    levels[depth + 1]?.buttons.find(button => !button.disabled)?.focus({ preventScroll: true });
                    return;
                }

                close(true);
                try {
                    action({ ...cell, id });
                } catch (error) {
                    showError(context, error);
                }
            });

            buttons.push(button);
            element.appendChild(button);
        }
    }

    buildMenu(entries, menu);

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

    (levels[0].buttons.find(button => !button.disabled) || menu).focus({ preventScroll: true });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('blur', onBlur);

    closeActiveMenu = close;

    return true;
}