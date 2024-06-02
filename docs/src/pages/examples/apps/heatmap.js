import SpreadGrid from "react-spread-gird";
import { useEffect, useState } from "react";

const ids = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX"];
const appData = ids.reduce((acc, row, rowIndex) => {
    acc[rowIndex] = ids.reduce((acc, column, columnIdex) => {
        acc[columnIdex] = Math.floor(Math.random() * 100);
        return acc;
    }, {});
    return acc;
}, {});

function colorFromValue(value) {
    if (value > 50)
        value = Math.min(100, value + 20);

    const hue = (value / 100) * 120;
    return {
        background: `hsl(${hue}, 100%, 70%)`,
        foreground: `hsl(${hue}, 70%, 30%)`
    };
}

const rows = [
    { type: "HEADER" },
    { type: "DATA-BLOCK", height: 'fit-once' }
];
const columns = [
    { type: "HEADER", width: 'fit-once' },
    { type: "DATA-BLOCK", width: 35 }
];
const formatting = [
    {
        style: ({ value, row, column, rows, columns, data }) => ({
            ...colorFromValue(value),
            textAlign: "right",
            borderBottom: row.index < rows.length - 1 && ((value > 50) ^ (data[rows[row.index + 1].id][column.id] > 50)) ? {
                width: 2,
                color: "hsl(0, 100%, 40%)"
            } : undefined,
            borderRight: column.index < columns.length - 1 && ((value > 50) ^ (data[row.id][columns[column.index + 1].id] > 50)) ? {
                width: 2,
                color: "hsl(0, 100%, 40%)"
            } : undefined
        }),
        text: ({ value }) => `${value}%`,
    },
    {
        column: { type: "HEADER" },
        style: ({ row }) => ({
            textAlign: "center",
            background: row.index % 2 === 0 ? "#EBEBEB" : "white"
        }),
        text: ({ row }) => ids[row.id],
    },
    {
        row: { type: "HEADER" },
        style: ({ column }) => ({
            textAlign: "center",
            background: column.index % 2 === 0 ? "#EBEBEB" : "white"
        }),
        text: ({ column }) => ids[column.id],
    },
];

export default function Heatmap() {
    const [data, setData] = useState(appData);

    useEffect(() => {
        const interval = setInterval(() => {
            setData((data) => {
                const newData = {};
                for (const row in data) {
                    newData[row] = { ...data[row] };
                    for (const column in data[row]) {
                        const oldValue = data[row][column];
                        const newValue = oldValue + Math.round(Math.random() * 10 - 5);
                        newData[row][column] = Math.max(0, Math.min(100, newValue));
                    }
                }
                return newData;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            pinnedLeft={1}
            formatting={formatting}
            borderWidth={0}
        />
    );
}