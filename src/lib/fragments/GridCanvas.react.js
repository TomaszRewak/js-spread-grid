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
    cells,
    columns,
    rows,
    showLeftBorder,
    showTopBorder,
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

    useEffect(() => {
        const draw = () => {
            if (!canvas)
                return;

            // Checking how often this is called
            console.log('draw');

            const roundToPixels = (value) => {
                return Math.round(value * devicePixelRatio) / devicePixelRatio;
            }

            const ctx = canvas.getContext("2d");
            // TODO: Make that "1" configurable as cell spacing
            const borderOffset = borderWidth / 2;
            const rowCount = rows.length;
            const columnCount = columns.length;
            const horizontalBorderCount = rowCount + (showTopBorder ? 1 : 0);
            const verticalBorderCount = columnCount + (showLeftBorder ? 1 : 0);
            const rowHeights = rows.map(row => row.height);
            const columnWidths = columns.map(column => column.width);
            const totalWidth = columnWidths.reduce((a, b) => a + b, 0) + verticalBorderCount * borderWidth;
            const totalHeight = rowHeights.reduce((a, b) => a + b, 0) + horizontalBorderCount * borderWidth;
            const left = (scrollLeft === undefined) ? 0 : scrollLeft;
            const top = (scrollTop === undefined) ? 0 : scrollTop;
            const width = (scrollWidth === undefined) ? totalWidth : scrollWidth;
            const height = (scrollHeight === undefined) ? totalHeight : scrollHeight;

            // TODO: Move somewhere else
            const columnOffsets = columnWidths.reduce((acc, width, index) => {
                const prevOffset = acc[index];
                const offset = prevOffset + width + borderWidth;
                acc.push(offset);
                return acc;
            }, [showLeftBorder ? borderWidth : 0]);
            const rowOffsets = rowHeights.reduce((acc, height, index) => {
                const prevOffset = acc[index];
                const offset = prevOffset + height + borderWidth;
                acc.push(offset);
                return acc;
            }, [showTopBorder ? borderWidth : 0]);

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
            columns.forEach((_, columnIndex) => {
                rows.forEach((_, rowIndex) => {
                    const cell = cells[rowIndex][columnIndex];
                    const style = cell.style;
                    const top = rowOffsets[rowIndex];
                    const left = columnOffsets[columnIndex];
                    const width = columnWidths[columnIndex];
                    const height = rowHeights[rowIndex];

                    ctx.fillStyle = style.background || 'white';
                    ctx.fillRect(left, top, width, height);

                    if (style.highlight) {
                        ctx.fillStyle = style.highlight;
                        ctx.fillRect(left, top, width, height);
                    }

                    ctx.fillStyle = "#000";
                    ctx.fillText(cell.value, left + 5, top + height - 5);
                });
            });

            // Draw borders

            // TODO: memo/move somewhere
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

                if (style.dash)
                {
                    ctx.setLineDash(style.dash.map(value => value / devicePixelRatio));
                    ctx.lineDashOffset = (isHorizontal ? xa : ya);
                }
                else
                {
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

            // TODO: Move somewhere else
            // TODO: Don't actually combine borders, but use the ctx.lineDashOffset to align them (starting from (0, 0))
            for (let horizontalBorderIndex = 0; horizontalBorderIndex < horizontalBorderCount; horizontalBorderIndex++) {
                const topRowIndex = horizontalBorderIndex - 1 + (showTopBorder ? 0 : 1);
                const bottomRowIndex = topRowIndex + 1;

                for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                    const topBorderStyle = topRowIndex >= 0 ? cells[topRowIndex][columnIndex].style.borderBottom : null;
                    const bottomBorderStyle = bottomRowIndex < rowCount ? cells[bottomRowIndex][columnIndex].style.borderTop : null;

                    const borderStyle = selectBorder(topBorderStyle, bottomBorderStyle);

                    drawBorder(
                        columnOffsets[columnIndex] - borderOffset,
                        rowOffsets[bottomRowIndex] - borderOffset,
                        columnOffsets[columnIndex + 1] - borderOffset,
                        rowOffsets[bottomRowIndex] - borderOffset,
                        borderStyle);
                }
            }

            for (let verticalBorderIndex = 0; verticalBorderIndex < verticalBorderCount; verticalBorderIndex++) {
                const leftColumnIndex = verticalBorderIndex - 1 + (showLeftBorder ? 0 : 1);
                const rightColumnIndex = leftColumnIndex + 1;

                for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                    const leftBorderStyle = leftColumnIndex >= 0 ? cells[rowIndex][leftColumnIndex].style.borderRight : null;
                    const rightBorderStyle = rightColumnIndex < columnCount ? cells[rowIndex][rightColumnIndex].style.borderLeft : null;

                    const borderStyle = selectBorder(leftBorderStyle, rightBorderStyle);

                    drawBorder(
                        columnOffsets[rightColumnIndex] - borderOffset,
                        rowOffsets[rowIndex] - borderOffset,
                        columnOffsets[rightColumnIndex] - borderOffset,
                        rowOffsets[rowIndex + 1] - borderOffset,
                        borderStyle);
                }
            }
        };

        const nextFrame = requestAnimationFrame(draw);

        // Can this ever be starved out?
        return () => cancelAnimationFrame(nextFrame);
    }, [cells, canvas, devicePixelRatio, showTopBorder, showLeftBorder, rows, columns, scrollLeft, scrollTop, scrollWidth, scrollHeight, borderWidth]);

    // TODO: style={{imageRendering: 'pixelated'}} - is this even needed, though?
    // TODO: memoize style
    return (
        <canvas ref={setCanvas} style={style} />
    );
}