<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    // collapse: true
    columns={[{ type: 'DATA-BLOCK', width: 70 }]}
    // collapse: false
    rows={[
        { type: "HEADER", id: "top-header" },
        { id: 0, labels: ["sort-by-top"] },
        { id: 1, labels: ["sort-by-top"] },
        { id: 2, labels: ["sort-by-top"] },
        { id: 3, labels: ["sort-by-top"] },
        { type: "HEADER", id: "bottom-header" },
        { id: 4, labels: ["sort-by-bottom"] },
        { id: 5, labels: ["sort-by-bottom"] },
        { id: 6, labels: ["sort-by-bottom"] }
    ]}
    sorting={[
        {
            row: { label: "sort-by-top" },
            by: "top-header"
        },
        {
            row: { label: "sort-by-bottom" },
            by: "bottom-header"
        }
    ]}
/>