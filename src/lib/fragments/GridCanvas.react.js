import React, { useCallback, useEffect, useState } from "react"
import useDevicePixelRatio from "../hooks/useDevicePixelRatio";

/**
 * @param {{
 *   cells: {
 *     value: string
 *   }[][]
 * }} props
 */
export default function GridCanvas({
    cells
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
            const borderWidth = 1 / devicePixelRatio;
            const borderOffset = borderWidth / 2;
            const cellSize = roundToPixels(20);
            const width = roundToPixels(cells[0].length * cellSize + borderWidth);
            const height = roundToPixels(cells.length * cellSize + borderWidth);

            canvas.width = width * devicePixelRatio;
            canvas.height = height * devicePixelRatio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(devicePixelRatio, devicePixelRatio);

            // Draw cells
            cells.forEach((row, y) => {
                row.forEach((cell, x) => {
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx.fillStyle = "#000";
                    ctx.fillText(cell.value, x * cellSize + 10, y * cellSize + 10);
                });
            });

            // Draw borders
            ctx.strokeStyle = "#000";
            ctx.lineWidth = borderWidth;
            ctx.beginPath();
            cells.forEach((row, y) => {
                row.forEach((cell, x) => {
                    ctx.beginPath();
                    ctx.moveTo(x * cellSize + borderOffset, y * cellSize + borderOffset);
                    ctx.lineTo(x * cellSize + cellSize + borderOffset, y * cellSize + borderOffset);
                    ctx.lineTo(x * cellSize + cellSize + borderOffset, y * cellSize + cellSize + borderOffset);
                    ctx.lineTo(x * cellSize + borderOffset, y * cellSize + cellSize + borderOffset);
                    ctx.closePath();
                    ctx.stroke();
                });
            });
            ctx.stroke();
        };

        const nextFrame = requestAnimationFrame(draw);

        // Can this ever be starved out?
        return () => cancelAnimationFrame(nextFrame);
    }, [cells, canvas, devicePixelRatio]);

    // style={{imageRendering: 'pixelated'}}
    return (
        <canvas ref={updateCanvas} />
    )
}