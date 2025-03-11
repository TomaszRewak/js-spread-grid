SpreadGrid(div, {
    data: [
        // collapse: true
        // default data
        // collapse: false
    ],
    formatting: [
        {
            // collapse: true
            column: { id: 'score' },
            // collapse: false
            tooltip: ({ value }) => value > 50
                ? `Good score<br><i style="color: green">${value}/100</i>`
                : `Bad score<br><i style="color: red">${value}/100</i>`
        }
    ]
});