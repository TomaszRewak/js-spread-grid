import SpreadGrid from "react-spread-gird";
import { useEffect, useState, useMemo, useCallback } from "react";

const tickSizes = [
    [10, 0.01],
    [100, 0.1],
    [null, 1]
]

function getPrice(index) {
    let price = 0;
    for (const [maxPrice, tickSize] of tickSizes) {
        const steps = (maxPrice - price) / tickSize;

        if (maxPrice === null || index < steps)
            return price + index * tickSize;

        price += steps * tickSize;
        index -= steps;
    }
}

function drawVolumeBar(ctx, value, maxValue, width, height, color, leftToRight) {
    if (!value)
        return;

    const barWidth = value / maxValue * width;

    ctx.fillStyle = color;
    if (leftToRight)
        ctx.fillRect(0, 0, barWidth, height);
    else
        ctx.fillRect(width - barWidth, 0, barWidth, height);
}

const rows = [
    { type: "HEADER", height: 15 },
    {
        type: "DYNAMIC-BLOCK",
        height: 15,
        count: 100000,
        id: ({ selector }) => getPrice(selector),
    },
    { type: "HEADER", height: 15 },
];

const columns = [
    { id: "bought", header: "", width: 5, labels: ["bid"] },
    { id: "our_bid", header: "ob", width: 30, labels: ["bid"] },
    { id: "market_bid", header: "mb", width: 40, labels: ["bid"] },
    { id: "price", header: "p", width: 50 },
    { id: "market_ask", header: "ma", width: 40, labels: ["ask"] },
    { id: "our_ask", header: "oa", width: 30, labels: ["ask"] },
    { id: "sold", header: "", width: 5, labels: ["ask"] },
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
        column: { id: "market_bid" },
        value: ({ row, data }) => data.market.bids[row.id] || 0,
    },
    {
        column: { id: "market_ask" },
        value: ({ row, data }) => data.market.asks[row.id] || 0,
    },
    {
        column: { id: "our_bid" },
        value: ({ row, data }) => data.our.bids[row.id] || 0,
    },
    {
        column: { id: "our_ask" },
        value: ({ row, data }) => data.our.asks[row.id] || 0,
    },
    {
        row: { type: "HEADER" },
        column: { label: "ask" },
        style: { background: "#981b1bff" }
    },
    {
        column: { id: "market_bid" },
        style: { background: "#f3f7ffff" },
        draw: ({ ctx, value, column, row, data }) => drawVolumeBar(ctx, value, data.maxVolume, column.width, row.height, "rgb(210, 222, 247)", false)
    },
    {
        column: { id: "market_ask" },
        style: { background: "#fff7f7ff" },
        draw: ({ ctx, value, column, row, data }) => drawVolumeBar(ctx, value, data.maxVolume, column.width, row.height, "rgb(245, 214, 214)", true)
    },
    {
        column: { id: "price" },
        value: ({ row }) => row.id,
        text: ({ value }) => value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2),
        style: { background: "#414141ff", foreground: "white", border: { width: 1, color: "#9b9b9b" } }
    },
    {
        column: [{ id: "market_bid" }, { id: "market_ask" }, { id: "our_bid" }, { id: "our_ask" }],
        text: ({ value }) => value ? `${value}` : "",
    },
    {
        column: { id: "price" },
        condition: ({ value, data }) => value <= data.bidPrice,
        style: { background: "#58608b" }
    },
    {
        column: { id: "price" },
        condition: ({ value, data }) => value >= data.askPrice,
        style: { background: "#8b585b" }
    },
    {
        column: { id: "price" },
        condition: ({ value, data }) => value === data.initPrice,
        style: { background: "#888b58" }
    },
    {
        column: [{ id: "our_bid" }, { id: "our_ask" }],
        condition: ({ row }) => row.selector % 10 === 0,
        style: { background: "#f7f7f7" }
    },
    {
        column: [{ id: "our_bid" }, { id: "our_ask" }],
        condition: ({ value }) => value,
        font: "bold 12px Calibri",
        style: { foreground: "rgb(49, 114, 36)", background: "rgb(231, 255, 236)" }
    },
    {
        column: [{ id: "bought" }, { id: "sold" }],
        value: ({ row, data, column }) => data.our[column.id][row.id] || 0,
        text: '',
        style: ({ value }) => value ? { background: `rgb(49, 114, 36, ${value * 10}%)` } : {}
    }
];

function generateMarketOrders(bidIndex, askIndex, defaultSize, levels, bidAsymmetry) {
    const market = { bids: {}, asks: {} };
    for (let i = 0; i < levels; i++) {
        market.bids[getPrice(bidIndex - i)] = Math.floor((Math.random() / 5 + 1) * defaultSize * ((levels - i) / levels) ** 2 * bidAsymmetry);
    }
    for (let i = 0; i < levels; i++) {
        market.asks[getPrice(askIndex + i)] = Math.floor((Math.random() / 5 + 1) * defaultSize * ((levels - i) / levels) ** 2);
    }
    return market;
}

function generateOurOrders(middleIndex) {
    return {
        bids: {
            [getPrice(middleIndex - 2)]: 10,
            [getPrice(middleIndex - 5)]: 20,
            [getPrice(middleIndex - 6)]: 20,
            [getPrice(middleIndex - 7)]: 20
        },
        asks: {
            [getPrice(middleIndex + 2)]: 10,
            [getPrice(middleIndex + 5)]: 20,
            [getPrice(middleIndex + 6)]: 20,
            [getPrice(middleIndex + 7)]: 20
        },
        bought: {},
        sold: {}
    };
}

function uncrossOurOrders(ourOrders, bidIndex, askIndex) {
    const bidPrice = Math.max(getPrice(bidIndex), ...Object.keys(ourOrders.bids));
    const askPrice = Math.min(getPrice(askIndex), ...Object.keys(ourOrders.asks));
    const bids = { ...ourOrders.bids };
    const asks = { ...ourOrders.asks };
    const bought = { ...ourOrders.bought };
    const sold = { ...ourOrders.sold };

    for (const price in bids) {
        if (price >= askPrice) {
            delete bids[price];
            bought[price] = 10;
        }
    }

    for (const price in asks) {
        if (price <= bidPrice) {
            delete asks[price];
            sold[price] = 10;
        }
    }

    return {
        bids,
        asks,
        bought,
        sold
    };
}

function tickDownOurTrades(ourOrders) {
    const bought = {};
    for (const price in ourOrders.bought) {
        const value = ourOrders.bought[price] - 1;
        if (value > 0)
            bought[price] = value;
    }
    const sold = {};
    for (const price in ourOrders.sold) {
        const value = ourOrders.sold[price] - 1;
        if (value > 0)
            sold[price] = value;
    }
    return {
        ...ourOrders,
        bought,
        sold
    };
}

function DepthGrid({ initialMiddleIndex, defaultSize, levels, bidAsymmetry = 1, gap = 0 }) {
    const [middleIndex, setMiddleIndex] = useState(initialMiddleIndex);
    const bidIndex = middleIndex - gap;
    const askIndex = middleIndex + gap + 1;
    const [marketOrders, setMarketOrders] = useState(generateMarketOrders(bidIndex, askIndex, defaultSize, levels, bidAsymmetry));
    const [ourOrders, setOurOrders] = useState(generateOurOrders(initialMiddleIndex));
    const [focusedCell, setFocusedCell] = useState(null);
    const [selectedCells, setSelectedCells] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMiddleIndex(prev => prev + Math.round((Math.random() - 0.5) * 2));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketOrders(generateMarketOrders(bidIndex, askIndex, defaultSize, levels, bidAsymmetry));
        }, 100);
        return () => clearInterval(interval);
    }, [bidIndex, askIndex, defaultSize, levels, bidAsymmetry]);

    useEffect(() => {
        const interval = setInterval(() => {
            setOurOrders(prev => tickDownOurTrades(prev));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setOurOrders(prev => uncrossOurOrders(prev, bidIndex, askIndex));
    }, [bidIndex, askIndex]);

    const addBid = useCallback((level) => {
        setOurOrders(prev => uncrossOurOrders({
            ...prev,
            bids: { ...prev.bids, [level]: (prev.bids[level] || 0) + 10 },
        }, bidIndex, askIndex));
    }, [bidIndex, askIndex]);

    const addAsk = useCallback((level) => {
        setOurOrders(prev => uncrossOurOrders({
            ...prev,
            asks: { ...prev.asks, [level]: (prev.asks[level] || 0) + 10 }
        }, bidIndex, askIndex));
    }, [bidIndex, askIndex]);

    const removeBid = useCallback((level) => {
        setOurOrders(prev => {
            const newBids = { ...prev.bids };
            delete newBids[level];
            return { ...prev, bids: newBids };
        });
    }, []);

    const removeAsk = useCallback((level) => {
        setOurOrders(prev => {
            const newAsks = { ...prev.asks };
            delete newAsks[level];
            return { ...prev, asks: newAsks };
        });
    }, []);

    const onCellClick = useCallback((event) => {
        if (event.columnId === 'market_bid')
            addBid(event.rowId);
        if (event.columnId === 'market_ask')
            addAsk(event.rowId);
        if (event.columnId === 'our_bid')
            removeBid(event.rowId);
        if (event.columnId === 'our_ask')
            removeAsk(event.rowId);
        setFocusedCell(null);
        setSelectedCells([]);
    }, [addBid, addAsk, removeBid, removeAsk]);

    const data = useMemo(() => {
        const marketBids = { ...marketOrders.bids };
        const marketAsks = { ...marketOrders.asks };
        for (const price in ourOrders.bids)
            marketBids[price] = (marketBids[price] || 0) + ourOrders.bids[price];
        for (const price in ourOrders.asks)
            marketAsks[price] = (marketAsks[price] || 0) + ourOrders.asks[price];
        const maxVolume = Math.max(0, ...Object.values(marketBids), ...Object.values(marketAsks));
        return {
            bidPrice: Math.max(...Object.keys(marketBids)),
            askPrice: Math.min(...Object.keys(marketAsks)),
            initPrice: getPrice(initialMiddleIndex),
            market: {
                bids: marketBids,
                asks: marketAsks
            },
            our: ourOrders,
            maxVolume
        };
    }, [marketOrders, ourOrders, bidIndex, askIndex]);

    const verticalScrollTarget = useMemo(() => ({
        index: middleIndex + 0.5,
        position: 'MIDDLE',
        speed: [
            {
                pixelsPerSecond: 20,
                maxDistance: 50
            },
            {
                pixelsPerSecond: 100,
                maxDistance: 300
            }
        ],
    }), [middleIndex]);

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
                focusedCell={focusedCell}
                onFocusedCellChange={setFocusedCell}
                selectedCells={selectedCells}
                onSelectedCellsChange={setSelectedCells}
                verticalScrollTarget={verticalScrollTarget}
            />
        </div>
    );
}

export default function Depth() {
    return (
        <div style={{ maxHeight: '400px', display: 'flex', flexDirection: 'row', gap: '20px', background: '#222222' }}>
            <DepthGrid initialMiddleIndex={100} defaultSize={10} levels={4} gap={2} />
            <DepthGrid initialMiddleIndex={1200} defaultSize={1000} levels={10} />
            <DepthGrid initialMiddleIndex={10000} defaultSize={100} levels={30} bidAsymmetry={0.5} />
        </div>
    );
}