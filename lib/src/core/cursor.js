/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.Context} context
 */
export default function updateCursor(context) {
    const element = context.element;
    const cursorState = context.state.cursorState;

    if (cursorState.isReordering)
        element.style.cursor = 'move';
    else if (cursorState.resizableColumn && cursorState.resizableRow)
        element.style.cursor = 'nwse-resize';
    else if (cursorState.resizableColumn)
        element.style.cursor = 'col-resize';
    else if (cursorState.resizableRow)
        element.style.cursor = 'row-resize';
    else
        element.style.cursor = 'default';
}
