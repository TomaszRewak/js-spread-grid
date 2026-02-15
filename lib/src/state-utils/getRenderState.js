/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.Sections} sections
 * @param {number} devicePixelRatio
 * @param {Types.Rect} scrollRect
 * @param {Types.FormatResolver} renderFormatResolver
 * @param {number} borderWidth
 * @param {Types.TextResolver} textResolver
 * @returns {Types.RenderState}
 */
export default function getRenderState(sections, devicePixelRatio, scrollRect, renderFormatResolver, borderWidth, textResolver) {
    return { sections, devicePixelRatio, scrollRect, renderFormatResolver, borderWidth, textResolver };
}
