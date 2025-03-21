import roundToPixels from "../core-utils/roundToPixels.js";

/**
 * @param {Context} context
 * @param {VerticalSectionName} vertical
 * @param {HorizontalSectionName} horizontal
 */
function renderSection(context, vertical, horizontal) {
    const state = context.state;
    const canvas = context.canvases[`${vertical}-${horizontal}`];
    const verticalSection = state.sections[vertical];
    const horizontalSection = state.sections[horizontal];
    const columns = horizontalSection.columns;
    const rows = verticalSection.rows;
    const devicePixelRatio = state.devicePixelRatio;

    if (rows.length === 0 || columns.length === 0) {
        if (canvas.parentElement)
            canvas.parentElement.removeChild(canvas);
        return;
    }

    if (!canvas.parentElement)
        context.element.appendChild(canvas);

    // Checking how often this is called
    // console.log('draw');

    // TODO: Borders are still blurry after scrolling at high zoom-out levels

    const ctx = canvas.getContext("2d", { alpha: false });
    // TODO: Make that "1" configurable as cell spacing
    const scrollRect = state.scrollRect;
    const textResolver = state.textResolver;
    // TODO: Make sure those formatters are split based on the rule areas
    const formatResolver = state.renderFormatResolver;
    const borderWidth = state.borderWidth;
    const sectionBorders = {
        top: verticalSection.showTopBorder,
        bottom: verticalSection.showBottomBorder,
        left: horizontalSection.showLeftBorder,
        right: horizontalSection.showRightBorder
    };
    const borderOffset = borderWidth / 2;
    const rowCount = rows.length;
    const columnCount = columns.length;
    const horizontalBorderCount = rowCount - 1 + (sectionBorders.top ? 1 : 0) + (sectionBorders.bottom ? 1 : 0);
    const verticalBorderCount = columnCount - 1 + (sectionBorders.left ? 1 : 0) + (sectionBorders.right ? 1 : 0);
    const rowHeights = rows.map(row => row.height);
    const columnWidths = columns.map(column => column.width);
    const totalWidth = columnWidths.reduce((a, b) => a + b, 0) + verticalBorderCount * borderWidth;
    const totalHeight = rowHeights.reduce((a, b) => a + b, 0) + horizontalBorderCount * borderWidth;

    const left = horizontal === 'center'
        ? scrollRect.left
        : 0;
    const top = vertical === 'middle'
        ? scrollRect.top
        : 0;
    const width = horizontal === 'center'
        ? scrollRect.width
        : horizontalSection.width;
    const height = vertical === 'middle'
        ? scrollRect.height
        : verticalSection.height;

    // TODO: Move somewhere else
    const horizontalOffsets = columnWidths.reduce((acc, width, index) => {
        const prevOffset = acc[index];
        const offset = prevOffset + width + borderWidth;
        acc.push(offset);
        return acc;
    }, [sectionBorders.left ? borderWidth : 0]);
    const verticalOffsets = rowHeights.reduce((acc, height, index) => {
        const prevOffset = acc[index];
        const offset = prevOffset + height + borderWidth;
        acc.push(offset);
        return acc;
    }, [sectionBorders.top ? borderWidth : 0]);

    const columnOffsets = horizontalOffsets.slice(0, -1);
    const rowOffsets = verticalOffsets.slice(0, -1);

    const minVisibleColumnIndex = Math.max(columnOffsets.findLastIndex(offset => offset <= left), 0);
    const maxVisibleColumnIndex = columnOffsets.findLastIndex(offset => offset <= left + width);
    const minVisibleRowIndex = Math.max(rowOffsets.findLastIndex(offset => offset <= top), 0);
    const maxVisibleRowIndex = rowOffsets.findLastIndex(offset => offset <= top + height);

    const minVisibleVerticalBorderIndex = Math.max(minVisibleColumnIndex, sectionBorders.left ? 0 : 1);
    const maxVisibleVerticalBorderIndex = maxVisibleColumnIndex + (sectionBorders.right ? 1 : 0);
    const minVisibleHorizontalBorderIndex = Math.max(minVisibleRowIndex, sectionBorders.top ? 0 : 1);
    const maxVisibleHorizontalBorderIndex = maxVisibleRowIndex + (sectionBorders.bottom ? 1 : 0);

    const cells = Array.from({ length: maxVisibleRowIndex - minVisibleRowIndex + 1 }, (_, rowIndex) => {
        const row = rows[rowIndex + minVisibleRowIndex];
        return Array.from({ length: maxVisibleColumnIndex - minVisibleColumnIndex + 1 }, (_, columnIndex) => {
            const column = columns[columnIndex + minVisibleColumnIndex];
            return formatResolver.resolve(row, column);
        });
    });

    /**
     * @param {number} rowIndex
     * @param {number} columnIndex
     * @returns {Cell}
     */
    const getCell = (rowIndex, columnIndex) => cells[rowIndex - minVisibleRowIndex][columnIndex - minVisibleColumnIndex];

    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.marginLeft = `${left}px`;
    canvas.style.marginTop = `${top}px`;
    canvas.style.marginRight = `${totalWidth - width - left}px`;
    canvas.style.marginBottom = `${totalHeight - height - top}px`;;

    ctx.fillStyle = "#E9E9E9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /**
     * @param {number} x
     * @param {number} y
     */
    const setTransform = (x, y) => {
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, (x - left) * devicePixelRatio, (y - top) * devicePixelRatio);
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    const setClip = (x, y, width, height) => {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();
    };

    // Draw cells
    for (let columnIndex = minVisibleColumnIndex; columnIndex <= maxVisibleColumnIndex; columnIndex++) {
        for (let rowIndex = minVisibleRowIndex; rowIndex <= maxVisibleRowIndex; rowIndex++) {
            const cell = getCell(rowIndex, columnIndex);
            const style = cell.style;
            const cellTop = verticalOffsets[rowIndex];
            const cellLeft = horizontalOffsets[columnIndex];
            const cellWidth = columnWidths[columnIndex];
            const cellHeight = rowHeights[rowIndex];
            const text = cell.text;
            const textBaseline = style.textBaseline || 'middle';
            const padding = cell.padding;

            setTransform(cellLeft, cellTop);

            ctx.fillStyle = style.background || 'white';
            ctx.fillRect(0, 0, cellWidth, cellHeight);

            if ('draw' in cell)
                cell.draw(ctx);

            if (style.highlight) {
                ctx.fillStyle = style.highlight;
                ctx.fillRect(0, 0, cellWidth, cellHeight);
            }

            if (style.corner) {
                ctx.fillStyle = style.corner;
                ctx.beginPath();
                ctx.moveTo(cellWidth - 7, cellHeight);
                ctx.lineTo(cellWidth, cellHeight);
                ctx.lineTo(cellWidth, cellHeight - 7);
                ctx.fill();
            }

            if (text) {
                ctx.fillStyle = style.foreground || 'black';
                ctx.font = cell.font;

                const fontMetrics = textResolver.getFontMetrics(cell.font);

                const textAlign = (style.textAlign == 'center' && textResolver.measureWidth(text, cell.font) > cellWidth - padding.left - padding.right)
                    ? 'left'
                    : style.textAlign || 'left';
                ctx.textAlign = textAlign;

                // TODO: Make sure that values are rounded using devicePixelRatio
                const textX = roundToPixels(
                    textAlign === 'left' ? padding.left :
                        textAlign === 'center' ? cellWidth / 2 :
                            textAlign === 'right' ? cellWidth - padding.right :
                                0,
                    devicePixelRatio
                );

                const textY = roundToPixels(
                    textBaseline === 'top' ? fontMetrics.middle + fontMetrics.topOffset + padding.top :
                        textBaseline === 'middle' ? cellHeight / 2 + fontMetrics.middle :
                            textBaseline === 'bottom' ? cellHeight + fontMetrics.middle - fontMetrics.bottomOffset - padding.bottom :
                                0,
                    devicePixelRatio
                );

                ctx.save();
                setClip(0, 2 * borderWidth, cellWidth, cellHeight - 4 * borderWidth);
                ctx.fillText(text, textX, textY);
                ctx.restore();
            }
        }
    }

    setTransform(0, 0);

    // Draw borders

    // TODO: clip drawing area to the middle of neighboring columns/rows (might be useful for redrawing only the changed cells)
    // TODO: move somewhere (?)
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {Border} style
     */
    const drawBorder = (x1, y1, x2, y2, style) => {
        if (!style)
            return;
        if (style.width === 0)
            return;

        const width = style.width / devicePixelRatio

        const isHorizontal = y1 === y2;

        // TODO: Don't add offset if the border is not continued
        const xa = x1 - (isHorizontal ? width / 2 : 0);
        const ya = y1 - (!isHorizontal ? width / 2 : 0);
        const xb = x2 + (isHorizontal ? width / 2 : 0);
        const yb = y2 + (!isHorizontal ? width / 2 : 0);

        ctx.strokeStyle = style.color || 'black'; // TODO: resolve this color earlier
        ctx.lineWidth = width;

        if (style.dash) {
            ctx.setLineDash(style.dash.map(value => value / devicePixelRatio));
            ctx.lineDashOffset = (isHorizontal ? xa : ya);
        }
        else {
            ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.stroke();
    }

    /**
     * @param {Border} borderStyleA
     * @param {Border} borderStyleB
     * @returns {Border}
     */
    const selectBorder = (borderStyleA, borderStyleB) => {
        if (!borderStyleA)
            return borderStyleB;

        if (!borderStyleB)
            return borderStyleA;

        if (borderStyleA.index > borderStyleB.index)
            return borderStyleA;

        return borderStyleB;
    }

    // TODO: Move somewhere else (?)
    for (let horizontalBorderIndex = minVisibleHorizontalBorderIndex; horizontalBorderIndex <= maxVisibleHorizontalBorderIndex; horizontalBorderIndex++) {
        const topRowIndex = horizontalBorderIndex - 1;
        const bottomRowIndex = horizontalBorderIndex;

        for (let columnIndex = minVisibleColumnIndex; columnIndex <= maxVisibleColumnIndex; columnIndex++) {
            const topBorderStyle = topRowIndex >= minVisibleRowIndex ? getCell(topRowIndex, columnIndex).style.borderBottom : null;
            const bottomBorderStyle = bottomRowIndex <= maxVisibleRowIndex ? getCell(bottomRowIndex, columnIndex).style.borderTop : null;

            const borderStyle = selectBorder(topBorderStyle, bottomBorderStyle);

            drawBorder(
                horizontalOffsets[columnIndex] - borderOffset,
                verticalOffsets[bottomRowIndex] - borderOffset,
                horizontalOffsets[columnIndex + 1] - borderOffset,
                verticalOffsets[bottomRowIndex] - borderOffset,
                borderStyle);
        }
    }

    for (let verticalBorderIndex = minVisibleVerticalBorderIndex; verticalBorderIndex <= maxVisibleVerticalBorderIndex; verticalBorderIndex++) {
        const leftColumnIndex = verticalBorderIndex - 1;
        const rightColumnIndex = verticalBorderIndex;

        for (let rowIndex = minVisibleRowIndex; rowIndex <= maxVisibleRowIndex; rowIndex++) {
            const leftBorderStyle = leftColumnIndex >= minVisibleColumnIndex ? getCell(rowIndex, leftColumnIndex).style.borderRight : null;
            const rightBorderStyle = rightColumnIndex <= maxVisibleColumnIndex ? getCell(rowIndex, rightColumnIndex).style.borderLeft : null;

            const borderStyle = selectBorder(leftBorderStyle, rightBorderStyle);

            drawBorder(
                horizontalOffsets[rightColumnIndex] - borderOffset,
                verticalOffsets[rowIndex] - borderOffset,
                horizontalOffsets[rightColumnIndex] - borderOffset,
                verticalOffsets[rowIndex + 1] - borderOffset,
                borderStyle);
        }
    }
}

/**
 * @param {Context} context
 */
function renderInput(context) {
    const element = context.element;
    const input = context.input;
    const state = context.state;
    const inputPlacement = state.inputPlacement;

    if (!inputPlacement) {
        if (input.parentElement) {
            const hasFocus = document.activeElement === input;
            input.parentElement.removeChild(input);
            if (hasFocus)
                element.focus({ preventScroll: true });
        }
        return;
    }

    const canvas = context.canvases[inputPlacement.section];

    input.style.left = 'left' in inputPlacement ? `${inputPlacement.left}px` : '0';
    input.style.top = 'top' in inputPlacement ? `${inputPlacement.top}px` : '0';
    input.style.right = 'right' in inputPlacement ? `${inputPlacement.right}px` : '0';
    input.style.bottom = 'bottom' in inputPlacement ? `${inputPlacement.bottom}px` : '0';
    input.style.marginLeft = 'marginLeft' in inputPlacement ? `${inputPlacement.marginLeft}px` : '0';
    input.style.marginTop = 'marginTop' in inputPlacement ? `${inputPlacement.marginTop}px` : '0';
    input.style.width = `${inputPlacement.width}px`;
    input.style.height = `${inputPlacement.height}px`;
    input.style.gridArea = canvas.style.gridArea;
    input.style.zIndex = canvas.style.zIndex;
    input.style.backgroundColor = state.isTextValid ? 'white' : '#eb3434';

    if (!input.parentElement) {
        const hasFocus = document.activeElement === element;
        element.appendChild(input);
        if (hasFocus)
            input.focus({ preventScroll: true });
    }
}

/**
 * @param {Context} context
 */
function renderCursor(context) {
    const element = context.element;
    const state = context.state;

    if (context.isReordering)
        element.style.cursor = 'move';
    else if (state.resizableColumn && state.resizableRow)
        element.style.cursor = 'nwse-resize';
    else if (state.resizableColumn)
        element.style.cursor = 'col-resize';
    else if (state.resizableRow)
        element.style.cursor = 'row-resize';
    else
        element.style.cursor = 'default';
}

/** @param {Context} context */
function renderTooltip(context) {
    const element = context.element;
    const tooltip = context.tooltip;
    const content = context.state.tooltip;
    const placement = context.state.tooltipPlacement;

    if (!placement) {
        if (tooltip.parentElement)
            tooltip.parentElement.removeChild(tooltip);
        return;
    }

    if (tooltip.innerHTML !== content) {
        tooltip.innerHTML = content;
    }

    tooltip.style.left = `calc(anchor(left) + ${placement.left}px)`;
    tooltip.style.top = `calc(anchor(top) + ${placement.top}px)`;

    if (!tooltip.parentElement) {
        element.appendChild(tooltip);
        // @ts-ignore
        tooltip.showPopover({
            source: element,
        });
    }
}

/**
 * @param {Context} context
 */
function renderInternal(context) {
    renderSection(context, 'top', 'left');
    renderSection(context, 'top', 'center');
    renderSection(context, 'top', 'right');
    renderSection(context, 'middle', 'left');
    renderSection(context, 'middle', 'center');
    renderSection(context, 'middle', 'right');
    renderSection(context, 'bottom', 'left');
    renderSection(context, 'bottom', 'center');
    renderSection(context, 'bottom', 'right');

    renderInput(context);
    renderCursor(context);
    renderTooltip(context);
}

/**
 * @param {Context} context
 */
function renderError(context) {
    if (context.errorRendered)
        return;

    context.errorRendered = true;

    const element = context.element;
    const error = context.error;

    element.style.backgroundColor = '#9f0000';
    element.style.color = 'white';
    element.style.padding = '20px';
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.userSelect = 'text';
    element.innerHTML = `
        <div style="font-size: 16px;">
            An error occurred while rendering the grid, please contact the support.
        </div>
        <div style="font-size: 20px; font-weight: bold; padding: 20px 0;">
            ${error.message}
        </div>
        <div style="font-size: 16px; white-space: pre-wrap;">${error.stack}</div>
    `;
}

/**
 * @param {Context} context
 */
export default function render(context) {
    if (!context.error) {
        try {
            renderInternal(context);
        }
        catch (error) {
            context.error = error;
        }
    }

    if (context.error)
        renderError(context);
}