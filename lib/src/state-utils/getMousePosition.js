/**
 * @param {MouseEvent} event
 * @returns {Position}
 */
export default function getMousePosition(event) {
    const element = event.currentTarget;

    if (!(element instanceof HTMLElement))
        throw new Error('Element is not an HTMLElement');

    const rect = element.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}