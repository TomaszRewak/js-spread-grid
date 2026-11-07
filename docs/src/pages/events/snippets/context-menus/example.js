SpreadGrid(div, {
    // collapse: true
    data: data,
    // collapse: false
    formatting: [
        {
            row: { type: 'DATA' },
            contextMenu: { id: 'inspect', content: 'Inspect cell' }
        },
        {
            row: { type: 'DATA' },
            contextMenu: ({ value }) => [
                'separator',
                { id: 'use-value', content: '<strong>Use value</strong>' },
                {
                    id: 'double',
                    content: typeof value === 'number' ? `Double ${value}` : 'Double number',
                    disabled: typeof value !== 'number'
                }
            ]
        }
    ],
    onContextMenuSelect: ({ id, columnId, rowId }) => {
        console.log('Selected action', id, 'for cell', columnId, rowId);
    }
});