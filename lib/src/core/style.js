/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.Context} context
 */
export default function style(context) {
    // console.log('style', context.state.styleState);

    const state = context.state.styleState;
    const element = context.element;
    const style = `
        max-width: 100vw;
        max-height: 100vh;
        overflow: auto;
        display: grid;
        position: relative;
        grid-template-columns: fit-content(0) fit-content(0) fit-content(0);
        grid-template-rows: fit-content(0) fit-content(0) fit-content(0);
        outline: none;
        user-select: none;
        touch-action: manipulation;
        scrollbar-width: ${state.scrollbarWidth};
    `

    element.setAttribute('style', style);
}