import SpreadGrid from "react-spread-gird";
import { useEffect, useState } from "react";

const rows = [
    { type: "HEADER", height: 15 },
    {
        type: "DYNAMIC-BLOCK",
        height: 15,
        count: 100000,
        selector: ({ index }) => index,
        id: ({ selector }) => selector,
        header: ({ selector }) => `${selector}`
    },
    { type: "HEADER", height: 30 },
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
            verticalScrollTarget={{
                index: 100,
                position: 'MIDDLE',
                speed: [
                    {
                        pixelsPerSecond: 300,
                        maxDistance: 500
                    }
                ],
                //disableOnHover: false
            }}
        />
    );
}

export default function Depth() {
    return (
        <DepthGrid />
    );
}