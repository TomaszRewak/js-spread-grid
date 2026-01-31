/** @import * as Types from '../typings.js' */

/**
 * @param {HTMLElement} element
 * @returns {Types.ClientSize}
 */
export default function getBoundingClientSize(element) {
    const rect = element.getBoundingClientRect();

    return {
        width: rect.width,
        height: rect.height
    };
}