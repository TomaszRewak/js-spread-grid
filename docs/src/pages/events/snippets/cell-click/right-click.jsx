<SpreadGrid
    data={{
        // collapse: true
        // default dict data
        // collapse: false
    }}
    enableRightClick
    onCellClick={({ columnId, rowId, button }) => {
        alert(`${button === 2 ? 'Right' : 'Left'} click: ${columnId}, ${rowId}`);
    }}
/>