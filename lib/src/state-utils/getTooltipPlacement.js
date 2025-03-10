/**
 * @param {string} tooltip
 * @param {Position} mousePosition
 * @returns {TooltipPlacement | null}
 */
export default function getTooltipPlacement(tooltip, mousePosition) {
    if (!tooltip)
        return null;

    return {
        left: mousePosition.x + 20,
        top: mousePosition.y + 20
    };
}