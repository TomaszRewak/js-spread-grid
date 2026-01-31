/** @import * as Types from "../typings.js"; */

import { area, clip, contains, expand, remove } from "../core-utils/rect.js";

const requiredMargin = 200;
const preloadedMargin = 400;
const emptyRect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};

/**
 * @param {Types.Rect | null} previous
 * @param {Types.ScrollOffset} scrollOffset
 * @param {Types.TotalSize} totalSize
 * @param {Types.FixedSize} fixedSize
 * @param {Types.ClientSize} boundingClientSize
 * @returns {Types.Rect}
 */
export default function getScrollRect(previous, scrollOffset, totalSize, fixedSize, boundingClientSize) {
    // TODO: Is it optimal to use getBoundingClientRect()?
    const prevScrollRect = previous || emptyRect;

    const totalRect = { left: 0, top: 0, ...totalSize };
    const bounds = remove(totalRect, fixedSize);
    const scrollRect = remove({ ...scrollOffset, ...boundingClientSize }, fixedSize);
    const requiredScrollRect = clip(bounds, expand(scrollRect, requiredMargin));
    const preloadedScrollRect = clip(bounds, expand(scrollRect, preloadedMargin));

    if (!contains(bounds, prevScrollRect))
        return preloadedScrollRect;

    if (!contains(prevScrollRect, requiredScrollRect))
        return preloadedScrollRect;

    if (area(prevScrollRect) > 2 * area(preloadedScrollRect))
        return preloadedScrollRect;

    return prevScrollRect;
}
