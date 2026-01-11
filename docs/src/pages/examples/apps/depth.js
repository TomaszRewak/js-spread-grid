import SpreadGrid from "react-spread-gird";
import { useEffect, useState } from "react";

const rows = [
    { type: "HEADER" },
    {
        type: "DYNAMIC-BLOCK",
        height: 15,
        count: 5
    },
    { id: 110, height: 15 },
    { id: 107, height: 15 },
    { id: 106, height: 15 },
    { id: 105, height: 15 },
    { id: 104, height: 15 },
    { id: 103, height: 15 },
    { id: 102, height: 15 },
    { id: 101, height: 15 },
    { id: 100, height: 15 },
    { id: 99, height: 15 },
    { id: 98, height: 15 },
    { id: 97, height: 15 },
    { id: 96, height: 15 },
    { id: 95, height: 15 },
    { id: 94, height: 15 },
    { id: 93, height: 15 },
    { id: 92, height: 15 },
    { id: 91, height: 15 },
    { id: 90, height: 15 },
    { id: 89, height: 15 },
    { id: 88, height: 15 },
    { id: 87, height: 15 },
    { id: 86, height: 15 },
    { id: 85, height: 15 },
    { id: 84, height: 15 },
    { id: 83, height: 15 },
    { id: 82, height: 15 },
    { id: 81, height: 15 },
    { id: 80, height: 15 },
    { id: 79, height: 15 },
    { id: 78, height: 15 },
    { id: 77, height: 15 },
    { id: 76, height: 15 },
    { id: 75, height: 15 },
    { id: 74, height: 15 },
    { id: 73, height: 15 },
    { id: 72, height: 15 },
    { id: 71, height: 15 },
    { id: 70, height: 15 },
    { id: 69, height: 15 },
    { id: 68, height: 15 },
    { id: 67, height: 15 },
    { id: 66, height: 15 },
    { id: 65, height: 15 },
];
const columns = [
    { id: "our_bid", header: "ob", width: 40, labels: ["bid"] },
    { id: "market_bid", header: "mb", width: 60, labels: ["bid"] },
    { id: "price", header: "p", width: 50 },
    { id: "market_ask", header: "ma", width: 60, labels: ["ask"] },
    { id: "our_ask", header: "oa", width: 40, labels: ["ask"] },
];
const formatting = [
    {
        style: { textAlign: "right" }
    },
    {
        row: { type: "HEADER" },
        style: { background: "#323232ff", foreground: "white", textAlign: "center" }
    },
    {
        row: { type: "HEADER" },
        column: { label: "bid" },
        style: { background: "#1b4398ff" }
    },
    {
        row: { type: "HEADER" },
        column: { label: "ask" },
        style: { background: "#981b1bff" }
    },
    {
        column: { id: "market_bid" },
        style: { background: "#f3f7ffff" }
    },
    {
        column: { id: "market_ask" },
        style: { background: "#fff7f7ff" }
    },
    {
        column: { id: "price" },
        value: ({ row }) => row.id,
        style: { background: "#414141ff", foreground: "white" }
    },
    {
        column: { id: "market_bid" },
        value: ({ row, data }) => data.market.bids[row.id] || "",
    },
    {
        column: { id: "market_ask" },
        value: ({ row, data }) => data.market.asks[row.id] || "",
    },
    {
        column: { id: "our_bid" },
        value: ({ row, data }) => data.our.bids[row.id] || "",
    },
    {
        column: { id: "our_ask" },
        value: ({ row, data }) => data.our.asks[row.id] || "",
    },
];
const appData = {
    market: {
        bids: {
            100: 10,
            99: 15,
            98: 20,
            97: 25,
            96: 30
        },
        asks: {
            101: 10,
            102: 15,
            103: 20,
            104: 25,
            105: 30
        }
    },
    our: {
        bids: {
            100: 5,
            97: 10
        },
        asks: {
            102: 5,
        }
    }
};

function DepthGrid() {
    const [data, setData] = useState(appData);

    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            formatting={formatting}
        />
    );
}

export default function Depth() {
    return (
        <DepthGrid />
    );
}