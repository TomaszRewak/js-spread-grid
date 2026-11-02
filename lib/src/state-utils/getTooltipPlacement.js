/** @import * as Types from "../typings.js"; */

/**
 * @param {string} tooltip
 * @param {Types.Position} mousePosition
 * @returns {Types.TooltipPlacement | null}
 */
export default function getTooltipPlacement(tooltip, mousePosition) {
    if (!tooltip)
        return null;

    return {
        left: mousePosition.x,
        top: mousePosition.y
    };
}