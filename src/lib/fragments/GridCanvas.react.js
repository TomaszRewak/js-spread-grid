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

            const ctx = canvas.getContext("2d");
            const cellSize = 20;
            const width = cells[0].length * cellSize;
            const height = cells.length * cellSize;

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
            ctx.lineWidth = 1 / devicePixelRatio;
            ctx.beginPath();
            cells.forEach((row, y) => {
                row.forEach((cell, x) => {
                    ctx.rect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                });
            });
            ctx.stroke();
        };

        const nextFrame = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(nextFrame);
    }, [cells, canvas, devicePixelRatio]);

    return (
        <canvas ref={updateCanvas} />
    )
}