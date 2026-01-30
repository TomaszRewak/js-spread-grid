/** @import * as Types from "../typings.js"; */

/**
 * @param {HTMLElement} element
 * @param {Types.Position} position
 * @param {Types.FixedSize} fixedSize
 * @param {Types.TotalSize} totalSize
 * @returns {Types.Position}
 */
export default function getInternalPosition(element, position, fixedSize, totalSize) {
    // TODO: sometimes mousePosition is outside of bounds and it crashes the click events
    const x = position.x;
    const y = position.y;

    const scrollOffset = {
        left: element.scrollLeft,
        top: element.scrollTop
    };

    const clientSize = {
        width: element.clientWidth,
        height: element.clientHeight
    };

    return {
        x: x <= fixedSize.left
            ? x
            : x >= clientSize.width // TODO: This will not work for resizing columns pinned to the right
                ? x + scrollOffset.left
                : x >= clientSize.width - fixedSize.right
                    ? totalSize.width - clientSize.width + x
                    : x + scrollOffset.left,
        y: y <= fixedSize.top
            ? y
            : y >= clientSize.height // TODO: This will not work for resizing rows pinned to the bottom
                ? y + scrollOffset.top
                : y >= clientSize.height - fixedSize.bottom
                    ? totalSize.height - clientSize.height + y
                    : y + scrollOffset.top
    };
}