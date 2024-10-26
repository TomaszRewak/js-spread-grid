/**
 * @param {number} value
 * @param {number} devicePixelRatio
 * @returns {number}
 */
export default function roundToPixels(value, devicePixelRatio) {
    return Math.round(value * devicePixelRatio) / devicePixelRatio;
}