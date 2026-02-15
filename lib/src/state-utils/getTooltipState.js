/** @import * as Types from "../typings.js"; */

/**
 * @param {string} tooltip
 * @param {Types.TooltipPlacement} tooltipPlacement
 * @returns {Types.TooltipState}
 */
export default function getTooltipState(tooltip, tooltipPlacement) {
    return { tooltip, tooltipPlacement };
}
