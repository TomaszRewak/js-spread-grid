import SpreadGrid from "react-spread-gird";
import { useEffect, useState, useMemo, useCallback } from "react";

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
    { type: "HEADER", height: 15 },
];
const columns = [
    { id: "our_bid", header: "ob", width: 30, labels: ["bid"] },
    { id: "market_bid", header: "mb", width: 40, labels: ["bid"] },
    { id: "price", header: "p", width: 50 },
    { id: "market_ask", header: "ma", width: 40, labels: ["ask"] },
    { id: "our_ask", header: "oa", width: 30, labels: ["ask"] },
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
        column: { id: "price" },
        condition: ({ value, data }) => value === data.middleLevel,
        style: { background: "#58608b" }
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
    {
        column: [{ id: "our_bid" }, { id: "our_ask" }],
        condition: ({ value }) => value,
        font: "bold 12px Calibri",
        style: { foreground: "rgb(49, 114, 36)", background: "rgb(231, 255, 236)" }
    }
];

function generateMarketOrders(middleLevel, defaultSize, levels) {
    const market = { bids: {}, asks: {} };
    for (let i = 0; i < levels; i++) {
        market.bids[middleLevel - i] = Math.floor((Math.random() + 1.5) * defaultSize * ((levels - i) / levels) ** 2);
    }
    for (let i = 0; i < levels; i++) {
        market.asks[middleLevel + i + 1] = Math.floor((Math.random() + 1.5) * defaultSize * ((levels - i) / levels) ** 2);
    }
    return market;
}

function uncrossOurOrders(ourOrders, middleLevel) {
    return {
        bids: Object.fromEntries(
            Object.entries(ourOrders.bids).filter(([price]) => Number(price) <= middleLevel)
        ),
        asks: Object.fromEntries(
            Object.entries(ourOrders.asks).filter(([price]) => Number(price) > middleLevel)
        )
    };
}

function DepthGrid({ initialMiddleLevel, defaultSize, levels }) {
    const [middleLevel, setMiddleLevel] = useState(initialMiddleLevel);
    const [marketOrders, setMarketOrders] = useState({ bids: {}, asks: {} });
    const [ourOrders, setOurOrders] = useState({ bids: { [initialMiddleLevel - 3]: 100 }, asks: { [initialMiddleLevel + 3]: 100 } });

    useEffect(() => {
        const interval = setInterval(() => {
            setMiddleLevel(prev => prev + Math.round((Math.random() - 0.5) * 2));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketOrders(generateMarketOrders(middleLevel, defaultSize, levels));
        }, 100);
        return () => clearInterval(interval);
    }, [middleLevel, defaultSize, levels]);

    useEffect(() => {
        setOurOrders(prev => uncrossOurOrders(prev, middleLevel));
    }, [middleLevel]);

    const addBid = useCallback((level) => {
        setOurOrders(prev => uncrossOurOrders({
            bids: { ...prev.bids, [level]: (prev.bids[level] || 0) + 10 },
            asks: prev.asks
        }, middleLevel));
    }, [middleLevel]);

    const addAsk = useCallback((level) => {
        setOurOrders(prev => uncrossOurOrders({
            bids: prev.bids,
            asks: { ...prev.asks, [level]: (prev.asks[level] || 0) + 10 }
        }, middleLevel));
    }, [middleLevel]);

    const removeBid = useCallback((level) => {
        setOurOrders(prev => {
            const newBids = { ...prev.bids };
            delete newBids[level];
            return { bids: newBids, asks: prev.asks };
        });
    }, []);

    const removeAsk = useCallback((level) => {
        setOurOrders(prev => {
            const newAsks = { ...prev.asks };
            delete newAsks[level];
            return { bids: prev.bids, asks: newAsks };
        });
    }, []);

    const onCellClick = useCallback((event) => {
        console.log(event);
        if (event.columnId === 'market_bid')
            addBid(event.rowId);
        if (event.columnId === 'market_ask')
            addAsk(event.rowId);
        if (event.columnId === 'our_bid')
            removeBid(event.rowId);
        if (event.columnId === 'our_ask')
            removeAsk(event.rowId);
    }, [addBid, addAsk, removeBid, removeAsk]);

    const data = useMemo(() => {
        const marketBids = { ...marketOrders.bids };
        const marketAsks = { ...marketOrders.asks };
        for (const price in ourOrders.bids)
            marketBids[price] = (marketBids[price] || 0) + ourOrders.bids[price];
        for (const price in ourOrders.asks)
            marketAsks[price] = (marketAsks[price] || 0) + ourOrders.asks[price];
        return {
            middleLevel,
            market: {
                bids: marketBids,
                asks: marketAsks
            },
            our: ourOrders
        };

    }, [marketOrders, ourOrders, middleLevel]);

    return (
        <div style={{ display: 'flex', overflow: "hidden", background: "white" }}>
            <SpreadGrid
                data={data}
                rows={rows}
                columns={columns}
                pinnedTop={1}
                pinnedBottom={1}
                height={600}
                formatting={formatting}
                onCellClick={onCellClick}
                verticalScrollTarget={{
                    index: middleLevel,
                    position: 'MIDDLE',
                    speed: [
                        {
                            pixelsPerSecond: 100,
                            maxDistance: 200
                        }
                    ],
                    //disableOnHover: false
                }}
            />
        </div>
    );
}

export default function Depth() {
    return (
        <div style={{ maxHeight: '400px', display: 'flex', flexDirection: 'row', gap: '20px', background: '#222222' }}>
            <DepthGrid initialMiddleLevel={100} defaultSize={10} levels={4} />
            <DepthGrid initialMiddleLevel={1000} defaultSize={1000} levels={10} />
            <DepthGrid initialMiddleLevel={750} defaultSize={100} levels={30} />
        </div>
    );
}