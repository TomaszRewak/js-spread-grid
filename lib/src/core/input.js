/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.Context} context
 */
export default function showInput(context) {
    const element = context.element;
    const input = context.input;
    const inputState = context.state.inputState;
    const inputPlacement = inputState.inputPlacement;

    if (!inputPlacement) {
        if (input.parentElement) {
            const hasFocus = document.activeElement === input;
            input.parentElement.removeChild(input);
            if (hasFocus)
                element.focus({ preventScroll: true });
        }
        return;
    }

    const canvas = context.canvases[inputPlacement.section];

    input.style.left = 'left' in inputPlacement ? `${inputPlacement.left}px` : '0';
    input.style.top = 'top' in inputPlacement ? `${inputPlacement.top}px` : '0';
    input.style.right = 'right' in inputPlacement ? `${inputPlacement.right}px` : '0';
    input.style.bottom = 'bottom' in inputPlacement ? `${inputPlacement.bottom}px` : '0';
    input.style.marginLeft = 'marginLeft' in inputPlacement ? `${inputPlacement.marginLeft}px` : '0';
    input.style.marginTop = 'marginTop' in inputPlacement ? `${inputPlacement.marginTop}px` : '0';
    input.style.width = `${inputPlacement.width}px`;
    input.style.height = `${inputPlacement.height}px`;
    input.style.gridArea = canvas.style.gridArea;
    input.style.zIndex = canvas.style.zIndex;
    input.style.backgroundColor = inputState.isTextValid ? 'white' : '#eb3434';

    if (!input.parentElement) {
        const hasFocus = document.activeElement === element;
        element.appendChild(input);
        if (hasFocus)
            input.focus({ preventScroll: true });
    }
}
