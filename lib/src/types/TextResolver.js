import { defaultFont } from "../core-utils/defaults.js";

export default class TextResolver
{
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.fontMetrics = new Map();
    }

    measureWidth(text, font) {
        const ctx = this.context;

        ctx.font = font || defaultFont;

        const textMetrics = ctx.measureText(text);

        return textMetrics.width;
    }

    measureHeight(text, font) {
        let lines = 1;
        for (const char of text) {
            if (char === '\n')
                lines++;
        }

        return lines * this.getFontMetrics(font).height;
    }

    getFontMetrics(font) {
        const key = font;

        if (this.fontMetrics.has(key))
            return this.fontMetrics.get(key);

        const ctx = this.context;

        // TODO: Set other font properties
        ctx.font = font || defaultFont;

        const textMetrics = ctx.measureText('X');

        const middle = (textMetrics.actualBoundingBoxDescent - textMetrics.actualBoundingBoxAscent) / 2;
        const topOffset = middle + textMetrics.fontBoundingBoxAscent;
        const bottomOffset = textMetrics.fontBoundingBoxDescent - middle;
        const height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

        const fontMetrics = {
            topOffset: topOffset,
            middle: -middle,
            bottomOffset: bottomOffset,
            height: height
        };

        this.fontMetrics.set(key, fontMetrics);

        return fontMetrics;
    }
}