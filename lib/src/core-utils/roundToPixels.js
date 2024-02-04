export default function roundToPixels(value, devicePixelRatio) {
    return Math.round(value * devicePixelRatio) / devicePixelRatio;
}