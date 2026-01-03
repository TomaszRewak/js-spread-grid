import SpreadGrid from "react-spread-gird";
import { useEffect, useState } from "react";

const rows = [
    { type: "HEADER" },
    {
        type: "DYNAMIC-BLOCK",
        height: 18,
        count: 20
    },
    { id: 105 },
    { id: 104 },
    { id: 103 },
    { id: 102 },
    { id: 101 },
    { id: 100 },
    { id: 99 },
    { id: 98 },
    { id: 97 },
    { id: 96 },
];
const columns = [
    { id: "our_bid", header: "ob", width: 40 },
    { id: "market_bid", header: "mb", width: 60 },
    { id: "price", header: "p", width: 50 },
    { id: "market_ask", header: "ma", width: 60 },
    { id: "our_ask", header: "oa", width: 40 },
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
        column: { id: "price" },
        value: ({ row }) => row.id,
        style: { background: "#323232ff", foreground: "white" }
    },
    {
        column: { id: "market_bid" },
        value: ({ row, data }) => data.market.bids[row.id] || "",
    },
    {
        column: { id: "market_ask" },
        value: ({ row, data }) => data.market.asks[row.id] || "",
    }
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