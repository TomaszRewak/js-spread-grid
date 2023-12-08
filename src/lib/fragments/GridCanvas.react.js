import React, { useEffect, useState } from "react"

// TODO: Upgrade to react 18 for better performance
/** TODO: update the arguments to reflect the real props
 * @param {{
 *   cells: {
 *     value: string
 *   }[][]
 *   rowHeight: number
 *   columnWidths: number[]
 *   showLeftBorder: bool // TODO: check if it's bool or boolean
 *   showTopBorder: bool
 * }} props
 */
export default function GridCanvas({
    data,
    columns,
    rows,
    formattingResolver,
    showLeftBorder,
    showTopBorder,
    showRightBorder,
    showBottomBorder,
    style,
    scrollLeft,
    scrollTop,
    scrollWidth,
    scrollHeight,
    borderWidth,
    devicePixelRatio
}) {
    const [canvas, setCanvas] = useState(null);

    // TODO: Read and apply: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas?retiredLocale=pl
    // TODO: Redraw only the cells that have actually changed
    useEffect(() => {
        const draw = () => {
            if (!canvas)
                return;

            // Checking how often this is called
            console.log('draw');

            const ctx = canvas.getContext("2d");
            // TODO: Make that "1" configurable as cell spacing
            const borderOffset = borderWidth / 2;
            const rowCount = rows.length;
            const columnCount = columns.length;
            const horizontalBorderCount = rowCount - 1 + (showTopBorder ? 1 : 0) + (showBottomBorder ? 1 : 0);
            const verticalBorderCount = columnCount - 1 + (showLeftBorder ? 1 : 0) + (showRightBorder ? 1 : 0);
            const rowHeights = rows.map(row => row.height);
            const columnWidths = columns.map(column => column.width);
            const totalWidth = columnWidths.reduce((a, b) => a + b, 0) + verticalBorderCount * borderWidth;
            const totalHeight = rowHeights.reduce((a, b) => a + b, 0) + horizontalBorderCount * borderWidth;
            const left = (scrollLeft === undefined) ? 0 : scrollLeft;
            const top = (scrollTop === undefined) ? 0 : scrollTop;
            const width = (scrollWidth === undefined) ? totalWidth : scrollWidth;
            const height = (scrollHeight === undefined) ? totalHeight : scrollHeight;

            // TODO: Move somewhere else
            const horizontalOffsets = columnWidths.reduce((acc, width, index) => {
                const prevOffset = acc[index];
                const offset = prevOffset + width + borderWidth;
                acc.push(offset);
                return acc;
            }, [showLeftBorder ? borderWidth : 0]);
            const verticalOffsets = rowHeights.reduce((acc, height, index) => {
                const prevOffset = acc[index];
                const offset = prevOffset + height + borderWidth;
                acc.push(offset);
                return acc;
            }, [showTopBorder ? borderWidth : 0]);

            const columnOffsets = horizontalOffsets.slice(0, -1);
            const rowOffsets = verticalOffsets.slice(0, -1);

            const minVisibleColumnIndex = Math.max(columnOffsets.findLastIndex(offset => offset <= left), 0);
            const maxVisibleColumnIndex = columnOffsets.findLastIndex(offset => offset <= left + width);
            const minVisibleRowIndex = Math.max(rowOffsets.findLastIndex(offset => offset <= top), 0);
            const maxVisibleRowIndex = rowOffsets.findLastIndex(offset => offset <= top + height);

            const minVisibleVerticalBorderIndex = Math.max(minVisibleColumnIndex, showLeftBorder ? 0 : 1);
            const maxVisibleVerticalBorderIndex = maxVisibleColumnIndex + (showRightBorder ? 1 : 0);
            const minVisibleHorizontalBorderIndex = Math.max(minVisibleRowIndex, showTopBorder ? 0 : 1);
            const maxVisibleHorizontalBorderIndex = maxVisibleRowIndex + (showBottomBorder ? 1 : 0);

            const cells = Array.from({ length: maxVisibleRowIndex - minVisibleRowIndex + 1 }, (_, rowIndex) => {
                const row = rows[rowIndex + minVisibleRowIndex];
                return Array.from({ length: maxVisibleColumnIndex - minVisibleColumnIndex + 1 }, (_, columnIndex) => {
                    const column = columns[columnIndex + minVisibleColumnIndex];
                    return formattingResolver.resolve(data, rows, columns, row, column);
                });
            });
            const getCell = (rowIndex, columnIndex) => cells[rowIndex - minVisibleRowIndex][columnIndex - minVisibleColumnIndex];

            canvas.width = Math.round(width * devicePixelRatio);
            canvas.height = Math.round(height * devicePixelRatio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.style.marginLeft = `${left}px`;
            canvas.style.marginTop = `${top}px`;
            canvas.style.marginRight = `${totalWidth - width - left}px`;
            canvas.style.marginBottom = `${totalHeight - height - top}px`;

            ctx.scale(devicePixelRatio, devicePixelRatio);
            ctx.translate(-left, -top);

            ctx.clearRect(0, 0, totalWidth, totalHeight);
            ctx.fillStyle = "#E9E9E9";
            ctx.fillRect(0, 0, totalWidth, totalHeight);

            // Draw cells
            for (let columnIndex = minVisibleColumnIndex; columnIndex <= maxVisibleColumnIndex; columnIndex++) {
                for (let rowIndex = minVisibleRowIndex; rowIndex <= maxVisibleRowIndex; rowIndex++) {
                    const cell = getCell(rowIndex, columnIndex);
                    const style = cell.style;
                    const top = verticalOffsets[rowIndex];
                    const left = horizontalOffsets[columnIndex];
                    const width = columnWidths[columnIndex];
                    const height = rowHeights[rowIndex];
                    const text = `X${cell.value}`;
                    const textAlign = style.textAlign || 'left';
                    const textBaseline = style.textBaseline || 'middle';

                    // TODO: Check what's the best place to save and restore the context (before or after setting the clip text parameters)
                    ctx.save();
                    ctx.translate(left, top);
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();

                    ctx.fillStyle = style.background || 'white';
                    ctx.fillRect(0, 0, width, height);

                    if (style.highlight) {
                        ctx.fillStyle = style.highlight;
                        ctx.fillRect(0, 0, width, height);
                    }

                    ctx.fillStyle = "#000";
                    ctx.font = "12px Calibri";

                    ctx.textAlign = textAlign;
                    // TODO: Measure 'X' character to find the actual middle baseline
                    ctx.textBaseline = textBaseline;

                    const textX = 
                        textAlign === 'left' ? 5 :
                        textAlign === 'center' ? width / 2 :
                        textAlign === 'right' ? width - 5 :
                        0;

                    const textY =
                        textBaseline === 'top' ? 5 :
                        textBaseline === 'middle' ? height / 2 :
                        textBaseline === 'bottom' ? height - 5 :
                        0;

                    ctx.fillText(text, textX, textY);

                    ctx.restore();
                }
            }

            // Draw borders

            // TODO: clip drawing area to the middle of neighboring columns/rows (might be useful for redrawing only the changed cells)
            // TODO: move somewhere (?)
            const drawBorder = (x1, y1, x2, y2, style) => {
                if (!style)
                    return;

                const width = style.width * borderWidth;

                const isHorizontal = y1 === y2;

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
        };

        const nextFrame = requestAnimationFrame(draw);

        // Can this ever be starved out?
        return () => cancelAnimationFrame(nextFrame);
    }, [canvas, devicePixelRatio, showTopBorder, showLeftBorder, showRightBorder, showBottomBorder, rows, columns, scrollLeft, scrollTop, scrollWidth, scrollHeight, borderWidth, formattingResolver, data]);

    // TODO: style={{imageRendering: 'pixelated'}} - is this even needed, though?
    // TODO: memoize style
    return (
        <canvas ref={setCanvas} style={style} />
    );
}