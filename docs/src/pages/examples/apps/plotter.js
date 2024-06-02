import { useCallback, useState } from "react";
import { useMemo } from "react";
import SpreadGrid from "react-spread-gird";

const maxDataPoints = 50;
const strategies = {
    "loader_static_v1": { enabled: true, data: [0] },
    "loader_static_v2": { enabled: true, data: [10] },
    "loader_static_v3": { enabled: true, data: [75] },
    "loader_dynamic_v1": { enabled: true, data: [7] },
    "loader_dynamic_v2": { enabled: true, data: [0] },
    "uploader_static_v1": { enabled: false, data: [0] },
    "uploader_static_v2": { enabled: true, data: [21] },
    "uploader_dynamic_v1": { enabled: false, data: [33] },
    "uploader_dynamic_v2": { enabled: true, data: [0] },
    "uploader_dynamic_v3": { enabled: true, data: [0] }
};

const updateData = (strategies) => {
    return Object.assign({}, ...Object.keys(strategies).map(key => {
        const strategy = strategies[key];
        const data = [...strategy.data];

        if (data.length >= maxDataPoints)
            data.shift();

        while (data.length < maxDataPoints) {
            const newPoint = strategy.enabled
                ? data[data.length - 1] + Math.random() * 10 - 5
                : 0;
            data.push(Math.max(0, Math.min(100, newPoint)));
        }

        const sortedData = [...data].sort((a, b) => a - b);

        return {
            [key]: {
                ...strategy,
                data,
                min: Math.min(...data),
                max: Math.max(...data),
                percentile_25: sortedData[Math.floor(sortedData.length * 0.25)],
                median: sortedData[Math.floor(sortedData.length * 0.5)],
                percentile_75: sortedData[Math.floor(sortedData.length * 0.75)]
            }
        };
    }));
};

const drawBoxPlot = (ctx, width, height, stats) => {
    if (stats.max === stats.min)
        return;

    const getX = (percent) => percent / 100 * (width - 10) + 5;
    const drawLine = (x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    const drawRect = (x, y, w, h) => {
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
    }

    const x0 = getX(stats.min);
    const x25 = getX(stats.percentile_25);
    const x50 = getX(stats.median);
    const x75 = getX(stats.percentile_75);
    const x100 = getX(stats.max);

    const y0 = height / 2 - 5;
    const h = 10;

    ctx.fillStyle = "#869ad9";
    ctx.strokeStyle = "#2a4291";
    ctx.lineWidth = 1;

    drawLine(x0, y0 + h / 2, x100, y0 + h / 2);
    drawLine(x0, y0, x0, y0 + h);
    drawLine(x100, y0, x100, y0 + h);
    drawRect(x25, y0, x75 - x25, h);
    drawLine(x50, y0, x50, y0 + h);
}

const drawLinePlot = (ctx, width, height, data) => {
    const getX = (index) => index / (data.length - 1) * width;
    const getY = (value) => height - value / 100 * (height - 5);

    ctx.strokeStyle = "#912a2a";
    ctx.fillStyle = "#ff9494";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));

    for (let i = 1; i < data.length; i++)
        ctx.lineTo(getX(i), getY(data[i]));

    ctx.stroke();

    ctx.lineTo(getX(data.length - 1), height);
    ctx.lineTo(getX(0), height);
    ctx.fill();
}

const columns = [
    { id: "enabled", width: 30, header: "" },
    { id: "name", header: "strategy" },
    { id: "box-plot", width: 100, header: "" },
    { id: "line-plot", width: 200, header: "" },
    { id: "current", width: 45, labels: ["stat"] },
    { id: "direction", width: 30, header: "" },
    { id: "min", width: 45, labels: ["stat", "extras"] },
    { id: "percentile_25", width: 45, header: "25%", labels: ["stat", "extras"] },
    { id: "median", width: 45, labels: ["stat", "extras"] },
    { id: "percentile_75", width: 45, header: "75%", labels: ["stat", "extras"] },
    { id: "max", width: 45, labels: ["stat", "extras"] }
];

const rows = [
    { type: "HEADER" },
    { type: "DATA-BLOCK", height: 30 },
]

const formatting = [
    {
        column: { id: "name" },
        value: ({ row }) => row.id
    },
    {
        column: { id: "enabled" },
        text: ({ value }) => (value ? "☑" : "☐"),
        style: ({ value }) => ({
            textAlign: "center",
            foreground: value ? "#00aa00" : "#aa0000"
        }),
        font: '18px Calibri',
    },
    {
        condition: ({ data, row }) => !data[row.id].enabled,
        style: { background: "#ffe0e0" }
    },
    {
        column: { id: "box-plot" },
        value: ({ data, row }) => data[row.id],
        text: '',
        draw: ({ ctx, column, row, value }) => drawBoxPlot(ctx, column.width, row.height, value)
    },
    {
        column: { id: "line-plot" },
        value: ({ data, row }) => data[row.id].data,
        text: '',
        draw: ({ ctx, column, row, value }) => drawLinePlot(ctx, column.width, row.height, value)
    },
    {
        column: { id: "current" },
        value: ({ data, row }) => data[row.id].data.at(-1),
    },
    {
        column: { label: "stat" },
        text: ({ value }) => value.toFixed(2),
        style: { textAlign: "right" }
    },
    {
        column: { label: "extras" },
        style: { foreground: "#bbbbbb" }
    },
    {
        column: { id: "direction" },
        style: { textAlign: "center" }
    },
    {
        column: { id: "direction" },
        condition: ({ data, row }) => data[row.id].data.at(-1) > data[row.id].data.at(-maxDataPoints / 4),
        text: "↑",
        style: { foreground: "#00aa00", background: "#aaffaa" }
    },
    {
        column: { id: "direction" },
        condition: ({ data, row }) => data[row.id].data.at(-1) < data[row.id].data.at(-maxDataPoints / 4),
        text: "↓",
        style: { foreground: "#aa0000", background: "#ffaaaa" }
    },
    {
        row: { type: "HEADER" },
        style: { textAlign: "center" }
    }
];

export default function Plotter() {
    const initialData = useMemo(() => updateData(strategies), []);
    const [data, setData] = useState(initialData);

    useMemo(() => {
        const interval = setInterval(() => {
            setData(updateData);
        }, 30);

        return () => clearInterval(interval);
    }, []);

    const onCellClick = useCallback(({ rowId, columnId }) => {
        if (columnId !== "enabled")
            return;

        setData((data) => Object.assign({}, data, {
            [rowId]: {
                ...data[rowId],
                enabled: !data[rowId].enabled
            }
        }));
    }, []);

    return (
        <SpreadGrid
            data={data}
            columns={columns}
            rows={rows}
            formatting={formatting}
            onCellClick={onCellClick}
        />
    )
}