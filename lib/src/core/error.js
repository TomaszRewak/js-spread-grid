/** @import * as Types from "../typings.js" **/

/**
 * @param {Types.Context} context
 * @param {Error} error
 */
export default function showError(context, error) {
    if (context.errorRendered)
        return;

    context.errorRendered = true;

    const element = context.element;

    element.style.backgroundColor = '#9f0000';
    element.style.color = 'white';
    element.style.padding = '20px';
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.userSelect = 'text';
    element.innerHTML = `
        <div style="font-size: 16px;">
            An error occurred while rendering the grid, please contact the support.
        </div>
        <div style="font-size: 20px; font-weight: bold; padding: 20px 0;">
            ${error.message}
        </div>
        <div style="font-size: 16px; white-space: pre-wrap;">${error.stack}</div>
    `;
}