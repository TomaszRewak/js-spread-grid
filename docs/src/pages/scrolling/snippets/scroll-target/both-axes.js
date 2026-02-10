SpreadGrid(div, {
    // collapse: true
    data: data,
    formatting: [
        { row: { id: 25 }, style: { background: '#cce5ff' } },
        { column: { id: 'c25' }, style: { background: '#cce5ff' } },
    ],
    pinnedTop: 1,
    pinnedLeft: 1,
    // collapse: false
    verticalScrollTarget: { index: 25 },
    horizontalScrollTarget: { index: 25 },
    verticalScrollSpeed: 'smooth',
    horizontalScrollSpeed: 'smooth',
});
