function render(filters) {
    SpreadGrid(div, {
        data: [
            // collapse: true
            // default data
            // collapse: false
        ],
        // collapse: true
        columns: [{ type: 'DATA-BLOCK', width: 70 }],
        // collapse: false
        filters: filters,
        onFiltersChange: render
    });
}

render([{ columnId: 'registered', expression: true }]);