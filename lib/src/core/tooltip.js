/** @import * as Types from "../typings.js"; */

import getPopupPosition from "../core-utils/getPopupPosition.js";

/**
 * @param {Types.Context} context
 */
export default function showTooltip(context) {
    const element = context.element;
    const tooltipElement = context.tooltip;
    const tooltipState = context.state.tooltipState;
    const content = tooltipState.tooltip;
    const placement = tooltipState.tooltipPlacement;

    if (!placement) {
        if (tooltipElement.parentElement)
            tooltipElement.parentElement.removeChild(tooltipElement);
        return;
    }

    if (tooltipElement.innerHTML !== content) {
        tooltipElement.innerHTML = content;
    }

    if (!tooltipElement.parentElement) {
        document.body.appendChild(tooltipElement);
    }

    tooltipElement.style.left = '0px';
    tooltipElement.style.top = '0px';

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewport = document.documentElement;
    const left = getPopupPosition(rect.left + placement.left, tooltipRect.width, viewport.clientWidth, 4, 8);
    const top = getPopupPosition(rect.top + placement.top, tooltipRect.height, viewport.clientHeight, 4, 20);

    tooltipElement.style.left = `${left}px`;
    tooltipElement.style.top = `${top}px`;
}
