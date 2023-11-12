import React, { useCallback, useEffect, useState } from "react"
import useDevicePixelRatio from "../hooks/useDevicePixelRatio";

/**
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
    rowHeight,
    columnWidths,
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
            const rowCount = cells.length;
            const columnCount = cells[0].length;
            const horizontalBorderCount = rowCount + (showTopBorder ? 1 : 0);
            const verticalBorderCount = columnCount + (showLeftBorder ? 1 : 0);
            const roundedRowHeight = roundToPixels(rowHeight);
            const roundedColumnWidths = columnWidths.map(roundToPixels);
            const width = roundedColumnWidths.reduce((a, b) => a + b, 0) + verticalBorderCount * borderWidth;
            const height = rowCount * roundedRowHeight + horizontalBorderCount * borderWidth;

            console.log(width * devicePixelRatio, height * devicePixelRatio);

            canvas.width = Math.round(width * devicePixelRatio);
            canvas.height = Math.round(height * devicePixelRatio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(devicePixelRatio, devicePixelRatio);

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "#f00";
            ctx.fillRect(0, 0, width, height);

            ctx.translate(
                showLeftBorder ? 0 : -borderWidth,
                showTopBorder ? 0 : -borderWidth
            );

            // Draw cells
            cells.forEach((row, y) => {
                const top = y * roundedRowHeight + (y + 1) * borderWidth;
                let left = borderWidth;

                row.forEach((cell, x) => {
                    const roundedColumnWidth = roundedColumnWidths[x];

                    ctx.fillStyle = "#fff";
                    ctx.fillRect(left, top, roundedColumnWidth, roundedRowHeight);
                    ctx.fillStyle = "#000";
                    ctx.fillText(cell.value, left + 5, top + roundedRowHeight - 5);

                    left += roundedColumnWidth + borderWidth;
                });
            });

            // Draw borders
            ctx.strokeStyle = "#000";
            ctx.lineWidth = borderWidth;
            ctx.beginPath();
            cells.forEach((row, y) => {
                const top = y * roundedRowHeight + y * borderWidth + borderOffset;
                let left = borderOffset;

                row.forEach((cell, x) => {
                    const roundedColumnWidth = roundedColumnWidths[x];

                    ctx.beginPath();
                    ctx.moveTo(left, top);
                    ctx.lineTo(left + roundedColumnWidth + borderWidth, top);
                    ctx.lineTo(left + roundedColumnWidth + borderWidth, top + roundedRowHeight + borderWidth);
                    ctx.lineTo(left, top + roundedRowHeight + borderWidth);
                    ctx.closePath();
                    ctx.stroke();

                    left += roundedColumnWidth + borderWidth;
                });
            });
        };

        const nextFrame = requestAnimationFrame(draw);

        // Can this ever be starved out?
        return () => cancelAnimationFrame(nextFrame);
    }, [cells, canvas, devicePixelRatio, rowHeight, columnWidths]);

    // style={{imageRendering: 'pixelated'}}
    return (
        <canvas ref={updateCanvas} />
    )
}