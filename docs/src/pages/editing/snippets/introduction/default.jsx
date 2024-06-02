const [editedCells, setEditedCells] = useState([  // eslint-disable-line
    { columnId: 'name', rowId: 'Alice', value: 'Anastasia' },
    { columnId: 'name', rowId: 'Bob', value: 'Bogdan' }
]);

<SpreadGrid
    data={{
        // collapse: true
        // default dict data
        // collapse: false
    }}
    // collapse: true
    columns={[{ type: 'DATA-BLOCK', width: 70 }]}
    // collapse: false
    formatting={[
        {
            column: [{ id: 'name' }],
            edit: true
        }
    ]}
    editedCells={editedCells}
    onEditedCellsChange={setEditedCells}
/>