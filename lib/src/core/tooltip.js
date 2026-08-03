/** @import * as Types from "../typings.js"; */

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

    const rect = element.getBoundingClientRect();
    tooltipElement.style.left = `${rect.left + placement.left}px`;
    tooltipElement.style.top = `${rect.top + placement.top}px`;

    if (!tooltipElement.parentElement) {
        document.body.appendChild(tooltipElement);
    }
}
