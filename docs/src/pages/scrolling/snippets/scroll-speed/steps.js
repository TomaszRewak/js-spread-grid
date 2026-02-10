SpreadGrid(div, {
    // collapse: true
    data: data,
    formatting: [{ row: { id: 100 }, style: { background: '#cce5ff' } }],
    pinnedTop: 1,
    // collapse: false
    verticalScrollTarget: { index: 100 },
    verticalScrollSpeed: [
        { scrollSpeed: 200, maxDistance: 500 },
        { scrollSpeed: 1000, maxDistance: 2000 },
        { scrollSpeed: 'smooth', maxDistance: Infinity },
    ],
});
