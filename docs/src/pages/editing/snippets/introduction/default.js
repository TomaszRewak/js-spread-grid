function render(editedCells) {
    SpreadGrid(div, {
        data: {
            // collapse: true
            // default dict data
            // collapse: false
        },
        // collapse: true
        columns: [{ type: 'DATA-BLOCK', width: 70 }],
        // collapse: false
        formatting: [
            {
                column: [{ id: 'name' }],
                edit: true
            }
        ],
        editedCells: editedCells,
        onEditedCellsChange: render
    });
}

render([
    { columnId: 'name', rowId: 'Alice', value: 'Anastasia' },
    { columnId: 'name', rowId: 'Bob', value: 'Bogdan' }
]);