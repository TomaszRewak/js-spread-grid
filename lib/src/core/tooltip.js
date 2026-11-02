/** @import * as Types from "../typings.js"; */

/**
 * @param {number} cursor
 * @param {number} size
 * @param {number} viewportSize
 * @param {number} marginBefore
 * @param {number} marginAfter
 * @returns {number}
 */
function getPosition(cursor, size, viewportSize, marginBefore, marginAfter) {
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
    const left = getPosition(rect.left + placement.left, tooltipRect.width, viewport.clientWidth, 4, 8);
    const top = getPosition(rect.top + placement.top, tooltipRect.height, viewport.clientHeight, 4, 20);

    tooltipElement.style.left = `${left}px`;
    tooltipElement.style.top = `${top}px`;
}
