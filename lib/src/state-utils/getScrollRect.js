import { area, clip, contains, expand, subtract } from "../core-utils/rect.js";

const requiredMargin = 200;
const preloadedMargin = 400;
const emptyRect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};

/**
 * @param {Rect | null} previous
 * @param {TotalSize} totalSize
 * @param {FixedSize} fixedSize
 * @param {HTMLElement} element
 * @returns {Rect}
 */
export default function getScrollRect(previous, totalSize, fixedSize, element) {
    // TODO: Is it optimal to use getBoundingClientRect()?
    const size = {
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height
    };
    const scrollOffset = {
        left: element.scrollLeft,
        top: element.scrollTop
    };

    const prevScrollRect = previous || emptyRect;

    const totalRect = { left: 0, top: 0, ...totalSize };
    const bounds = subtract(totalRect, fixedSize);
    const scrollRect = subtract({ ...scrollOffset, ...size }, fixedSize);
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
