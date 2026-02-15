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

    tooltipElement.style.left = `calc(anchor(left) + ${placement.left}px)`;
    tooltipElement.style.top = `calc(anchor(top) + ${placement.top}px)`;

    if (!tooltipElement.parentElement) {
        element.appendChild(tooltipElement);
        // @ts-ignore
        tooltipElement.showPopover({
            source: element,
        });
    }
}
