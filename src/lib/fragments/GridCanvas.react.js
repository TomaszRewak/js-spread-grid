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
    showTopBorder,
    style
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
            // TODO: Make that "1" configurable as cell spacing
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
            ctx.setLineDash([15 / devicePixelRatio, 15 / devicePixelRatio]);

            // TODO: memo/move somewhere
            const drawBorder = (x1, y1, x2, y2, style) => {
                if (!style)
                    return;

                const width = style.width * borderWidth;

                ctx.lineWidth = width;

                ctx.beginPath();
                ctx.moveTo(
                    x1 - (x1 !== x2 ? width / 2 : 0),
                    y1 - (y1 !== y2 ? width / 2 : 0));
                ctx.lineTo(
                    x2 + (x1 !== x2 ? width / 2 : 0),
                    y2 + (y1 !== y2 ? width / 2 : 0));
                ctx.stroke();
            }
            const compareBorders = (borderStyleA, borderStyleB) => {
                return borderStyleA?.width === borderStyleB?.width;
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
            for (let horizontalBorderIndex = 0; horizontalBorderIndex < horizontalBorderCount; horizontalBorderIndex++) {
                const topRowIndex = horizontalBorderIndex - 1 + (showTopBorder ? 0 : 1);
                const bottomRowIndex = topRowIndex + 1;

                let currentBorderStyle = null;
                let currentBorderIndex = null;

                const completeBorder = (columnIndex) => {
                    drawBorder(
                        columnOffsets[currentBorderIndex] - borderOffset,
                        rowOffsets[bottomRowIndex] - borderOffset,
                        columnOffsets[columnIndex] - borderOffset,
                        rowOffsets[bottomRowIndex] - borderOffset,
                        currentBorderStyle);
                };

                for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                    const topBorderStyle = topRowIndex >= 0 ? cells[topRowIndex][columnIndex].style.borderBottom : null;
                    const bottomBorderStyle = bottomRowIndex < rowCount ? cells[bottomRowIndex][columnIndex].style.borderTop : null;

                    const borderStyle = selectBorder(topBorderStyle, bottomBorderStyle);

                    if (!compareBorders(currentBorderStyle, borderStyle)) {
                        completeBorder(columnIndex);

                        currentBorderStyle = borderStyle;
                        currentBorderIndex = columnIndex;
                    }
                }

                completeBorder(columnCount);
            }

            for (let verticalBorderIndex = 0; verticalBorderIndex < verticalBorderCount; verticalBorderIndex++) {
                const leftColumnIndex = verticalBorderIndex - 1 + (showLeftBorder ? 0 : 1);
                const rightColumnIndex = leftColumnIndex + 1;

                let currentBorderStyle = null;
                let currentBorderIndex = null;

                const completeBorder = (rowIndex) => {
                    drawBorder(
                        columnOffsets[rightColumnIndex] - borderOffset,
                        rowOffsets[currentBorderIndex] - borderOffset,
                        columnOffsets[rightColumnIndex] - borderOffset,
                        rowOffsets[rowIndex] - borderOffset,
                        currentBorderStyle);
                };

                for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                    const leftBorderStyle = leftColumnIndex >= 0 ? cells[rowIndex][leftColumnIndex].style.borderRight : null;
                    const rightBorderStyle = rightColumnIndex < columnCount ? cells[rowIndex][rightColumnIndex].style.borderLeft : null;

                    const borderStyle = selectBorder(leftBorderStyle, rightBorderStyle);

                    if (!compareBorders(currentBorderStyle, borderStyle)) {
                        completeBorder(rowIndex);

                        currentBorderStyle = borderStyle;
                        currentBorderIndex = rowIndex;
                    }
                }

                completeBorder(rowCount);
            }
        };

        const nextFrame = requestAnimationFrame(draw);

        // Can this ever be starved out?
        return () => cancelAnimationFrame(nextFrame);
    }, [cells, canvas, devicePixelRatio, showTopBorder, showLeftBorder, rows, columns]);

    // style={{imageRendering: 'pixelated'}} - is this even needed, though?
    return (
        <canvas ref={updateCanvas} style={style} />
    )
}