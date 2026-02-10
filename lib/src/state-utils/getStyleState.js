/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.StyleOptions} styleOptions
 * @returns {Types.StyleState}
 */
export default function getStyleState(styleOptions) {
    return {
        scrollbarWidth: styleOptions.scrollbarWidth || 'auto',
    };
}