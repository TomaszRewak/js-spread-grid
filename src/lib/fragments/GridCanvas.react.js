import { useCallback, useEffect, useState } from "react"

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
    const canvasRef = useState(null);

    const setCanvasRef = useCallback((node) => {
        canvasRef.current = node;
    }, []);

    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const cellSize = 20;
            const width = cells[0].length * cellSize;
            const height = cells.length * cellSize;

            canvas.width = width;
            canvas.height = height;

            cells.forEach((row, y) => {
                row.forEach((cell, x) => {
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx.fillStyle = "#000";
                    ctx.fillText(cell.value, x * cellSize + 10, y * cellSize + 10);
                });
            });
        };

        const nextFrame = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(nextFrame);
    }, [cells, canvasRef]);

    return (
        <canvas ref={setCanvasRef} />
    )
}