/** @import * as Types from "../typings.js"; */

import { defaultFont } from "../core-utils/defaults.js";

export default class TextResolver {
    constructor() {
        /** @type {Map<string, Types.FontMetrics>} */
        this.fontMetrics = new Map();
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    /**
     * @param {string} text
     * @param {string} font
     * @returns {number}
     */
    measureWidth(text, font) {
        if (!text)
            return 0;

        const ctx = this.context;
        ctx.font = font || defaultFont;
        const textMetrics = ctx.measureText(text);

        return textMetrics.width;
    }

    /**
     * @param {string} text
     * @param {string} font
     * @returns {number}
     */
    measureHeight(text, font) {
        let lines = 1;
        for (const char of text) {
            if (char === '\n')
                lines++;
        }

        return lines * this.getFontMetrics(font).height;
    }

    /**
     * @param {string} font
     * @returns {Types.FontMetrics}
     */
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