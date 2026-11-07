createGrid(element, {
    // collapse: true
    data,
    // collapse: false
    formatting: [{
        row: { type: 'DATA' },
        column: { type: 'DATA' },
        contextMenu: {
            id: 'tools', content: 'Cell tools', submenu: [
                {
                    id: 'copy', content: 'Copy', submenu: [
                        { id: 'copy-value', content: 'Value' },
                        { id: 'copy-ids', content: 'Cell IDs' }
                    ]
                },
                {
                    id: 'export', content: 'Export', submenu: [
                        { id: 'export-json', content: 'JSON' },
                        { id: 'export-text', content: 'Text', disabled: true }
                    ]
                },
                'separator',
                { id: 'inspect', content: 'Inspect cell' }
            ]
        }
    }],
    onContextMenuSelect: selection => console.log(selection)
});