/** @import * as Types from "../typings.js"; */

import { defaultFont, defaultPadding } from "../core-utils/defaults.js";

/**
 * @param {Types.TextResolver} textResolver
 */
export default function getDynamicRowHeight(textResolver) {
    return textResolver.measureHeight('X', defaultFont) + defaultPadding.top + defaultPadding.bottom;
}