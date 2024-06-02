import { defaultPadding } from "../core-utils/defaults.js";

// TODO: add expand and expand-data

export function getMeasuredColumns(columns, rows, textResolver, formatResolver, measuringCache, presentKeys) {
    if (columns.every(column => typeof column.width === 'number'))
        return columns;

    const measureColumn = column => {
        const requestedWidth = column.width;

        if (typeof requestedWidth === 'number')
            return requestedWidth;

        if (measuringCache.has(column.key)) {
            const cached = measuringCache.get(column.key);

            if (requestedWidth === 'fit-once' && !cached.dataOnly)
                return cached.width;
            if (requestedWidth === 'fit-data-once' && cached.dataOnly)
                return cached.width;
        }

        let width = 0;
        for (const row of rows) {
            if (row.type !== 'DATA' && requestedWidth === 'fit-data-once')
                continue;
            if (row.type !== 'DATA' && requestedWidth === 'fit-data')
                continue;

            const cell = formatResolver.resolve(row, column);
            const text = cell.text;
            const font = cell.font;
            const padding = cell.padding.left + cell.padding.right;

            const cellWidth = textResolver.measureWidth(text, font) + padding;

            width = Math.max(width, cellWidth);
        }

        measuringCache.set(column.key, {
            width,
            dataOnly: requestedWidth === 'fit-data-once'
        });

        return width;
    }

    for (const key of measuringCache.keys()) {
        if (!presentKeys.has(key))
            measuringCache.delete(key);
    }

    return columns.map(column => ({
        ...column,
        width: measureColumn(column)
    }));
}

export function getMeasuredRows(columns, rows, textResolver, formatResolver, measuringCache, presentKeys) {
    if (rows.every(row => typeof row.height === 'number'))
        return rows;

    const measureRow = row => {
        const requestedHeight = row.height;

        if (typeof requestedHeight === 'number')
            return requestedHeight;

        if (measuringCache.has(row.key)) {
            const cached = measuringCache.get(row.key);

            if (requestedHeight === 'fit-once' && !cached.dataOnly)
                return cached.height;
            if (requestedHeight === 'fit-data-once' && cached.dataOnly)
                return cached.height;
        }

        let height = 0;
        for (const column of columns) {
            if (column.type !== 'DATA' && requestedHeight === 'fit-data-once')
                continue;
            if (column.type !== 'DATA' && requestedHeight === 'fit-data')
                continue;

            const cell = formatResolver.resolve(row, column);
            const text = cell.text;
            const font = cell.font;
            const padding = cell.padding.top + cell.padding.bottom;

            const cellHeight = textResolver.measureHeight(text, font) + padding;

            height = Math.max(height, cellHeight);
        }

        measuringCache.set(row.key, {
            height,
            dataOnly: requestedHeight === 'fit-data-once'
        });

        return height;
    }

    for (const key of measuringCache.keys()) {
        if (!presentKeys.has(key))
            measuringCache.delete(key);
    }

    return rows.map(row => ({
        ...row,
        height: measureRow(row)
    }));
}