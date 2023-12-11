export default class TextResolver
{
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.fontMetrics = new Map();
    }

    getFontMetrics(font) {
        const key = font;

        if (this.fontMetrics.has(key))
            return this.fontMetrics.get(key);

        const ctx = this.context;

        // TODO: Set other font properties
        ctx.font = font;

        const textMetrics = ctx.measureText('X');

        const middle = (textMetrics.actualBoundingBoxDescent - textMetrics.actualBoundingBoxAscent) / 2;
        const topOffset = middle + textMetrics.fontBoundingBoxAscent;
        const bottomOffset = textMetrics.fontBoundingBoxDescent - middle;

        const fontMetrics = {
            topOffset: topOffset,
            middle: -middle,
            bottomOffset: bottomOffset
        };

        this.fontMetrics.set(key, fontMetrics);

        return fontMetrics;
    }
}