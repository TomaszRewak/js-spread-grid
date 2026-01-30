/** @import * as Types from '../typings.js' */

/**
 * @param {HTMLElement} element
 * @returns {Types.ClientSize}
 */
export default function getClientSize(element) {
    return {
        width: element.clientWidth,
        height: element.clientHeight
    };
}