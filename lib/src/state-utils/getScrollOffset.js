/** @import * as Types from '../typings.js' */

/**
 * @param {HTMLElement} element
 * @returns {Types.ScrollOffset}
 */
export default function getScrollOffset(element) {
    return {
        left: element.scrollLeft,
        top: element.scrollTop
    };
}