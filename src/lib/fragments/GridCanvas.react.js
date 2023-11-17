import React, { useCallback, useEffect, useState } from "react"
import useDevicePixelRatio from "../hooks/useDevicePixelRatio";

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
    showTopBorder
}) {
    const [canvas, setCanvas] = useState(null);
    const devicePixelRatio = useDevicePixelRatio();

    const updateCanvas = useCallback((node) => {
        setCanvas(node);
    }, []);

    useEffect(() => {
        const draw = () => {
            if (!canvas)
                return;

            // Checking how often this is called
            console.log('draw');

            console.log(devicePixelRatio);

            const roundToPixels = (value) => {
                return Math.round(value * devicePixelRatio) / devicePixelRatio;
            }

            const ctx = canvas.getContext("2d");
            const borderWidth = 1 / devicePixelRatio; // Already rounded by definition
            const borderOffset = borderWidth / 2;
            const rowCount = rows.length;
            const columnCount = columns.length;
            const horizontalBorderCount = rowCount + (showTopBorder ? 1 : 0);
            const verticalBorderCount = columnCount + (showLeftBorder ? 1 : 0);
            const roundedRowHeights = rows.map(row => row.height).map(roundToPixels);
            const roundedColumnWidths = columns.map(column => column.width).map(roundToPixels);
            const width = roundedColumnWidths.reduce((a, b) => a + b, 0) + verticalBorderCount * borderWidth;
            const height = roundedRowHeights.reduce((a, b) => a + b, 0) + horizontalBorderCount * borderWidth;

            // TODO: Move somewhere else
            const columnOffsets = roundedColumnWidths.reduce((acc, width, index) => {
                const prevOffset = acc[index];
                const offset = prevOffset + width + borderWidth;
                acc.push(offset);
                return acc;
            }, [showLeftBorder ? borderWidth : 0]);
            const rowOffsets = roundedRowHeights.reduce((acc, height, index) => {
                const prevOffset = acc[index];
                const offset = prevOffset + height + borderWidth;
                acc.push(offset);
                return acc;
            }, [showTopBorder ? borderWidth : 0]);

            console.dir(columnOffsets);
            console.dir(rowOffsets);
            console.log(width * devicePixelRatio, height * devicePixelRatio);

            canvas.width = Math.round(width * devicePixelRatio);
            canvas.height = Math.round(height * devicePixelRatio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(devicePixelRatio, devicePixelRatio);

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "#ddd";
            ctx.fillRect(0, 0, width, height);

            // Draw cells
            columns.forEach((_, columnIndex) => {
                rows.forEach((_, rowIndex) => {
                    const cell = cells[rowIndex][columnIndex];
                    const style = cell.style;
                    const top = rowOffsets[rowIndex];
                    const left = columnOffsets[columnIndex];
                    const width = roundedColumnWidths[columnIndex];
                    const height = roundedRowHeights[rowIndex];

                    ctx.fillStyle = style.background || 'white';
                    ctx.fillRect(left, top, width, height);
                    ctx.fillStyle = "#000";
                    ctx.fillText(cell.value, left + 5, top + height - 5);
                });
            });

            // Draw borders
            ctx.strokeStyle = "#000";

            // TODO: memo/move somewhere
            const drawBorder = (x1, y1, x2, y2, style) => {
                const width = style.width * borderWidth;

                ctx.lineWidth = width;
                ctx.moveTo(
                    x1 - (x1 !== x2 ? width / 2 : 0),
                    y1 - (y1 !== y2 ? width / 2 : 0));
                ctx.lineTo(
                    x2 + (x1 !== x2 ? width / 2 : 0),
                    y2 + (y1 !== y2 ? width / 2 : 0));
                ctx.stroke();
            }

            // TODO: combine lines
            columns.forEach((_, columnIndex) => {
                rows.forEach((_, rowIndex) => {
                    const cell = cells[rowIndex][columnIndex];
                    const style = cell.style;

                    const top = rowOffsets[rowIndex] - borderOffset
                    const left = columnOffsets[columnIndex] - borderOffset;
                    const bottom = rowOffsets[rowIndex] + roundedRowHeights[rowIndex] + borderOffset;
                    const right = columnOffsets[columnIndex] + roundedColumnWidths[columnIndex] + borderOffset;

                    if (style.borderLeft)
                        drawBorder(left, top, left, bottom, style.borderLeft);

                    if (style.borderRight)
                        drawBorder(right, top, right, bottom, style.borderRight);

                    if (style.borderTop)
                        drawBorder(left, top, right, top, style.borderTop);

                    if (style.borderBottom)
                        drawBorder(left, bottom, right, bottom, style.borderBottom);
                });
            });
        };

        const nextFrame = requestAnimationFrame(draw);

        // Can this ever be starved out?
        return () => cancelAnimationFrame(nextFrame);
    }, [cells, canvas, devicePixelRatio, showTopBorder, showLeftBorder, rows, columns]);

    // style={{imageRendering: 'pixelated'}} - is this even needed, though?
    return (
        <canvas ref={updateCanvas} />
    )
}