SpreadGrid(div, {
    data: {
        // collapse: true
        // default dict data
        // collapse: false
    },
    enableRightClick: true,
    onCellClick: ({ columnId, rowId, button }) => {
        console.log(`${button === 2 ? 'Right' : 'Left'} click: ${columnId}, ${rowId}`);
    }
});