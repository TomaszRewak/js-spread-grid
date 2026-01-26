import roundToPixels from "../core-utils/roundToPixels.js";

// TODO: add expand and expand-data

/**
 * @param {ResolvedColumn[]} columns
 * @param {ResolvedRow[]} rows
 * @param {TextResolver} textResolver
 * @param {FormatResolver} formatResolver
 * @param {ColumnWidthCache} measuringCache
 * @param {Set<string>} presentKeys
 * @param {number} devicePixelRatio
 * @returns {MeasuredColumn[]}
 */
export function getMeasuredColumns(columns, rows, textResolver, formatResolver, measuringCache, presentKeys, devicePixelRatio) {
    if (columns.every(column => typeof column.width === 'number'))
        return /** @type {MeasuredColumn[]} */ (columns);

    /**
     * @param {ResolvedColumn} column
     * @returns {number}
     */
    const measureColumn = column => {
        if (column.type === 'DYNAMIC-BLOCK')
            return column.width;

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
            if (row.type === 'DYNAMIC-BLOCK')
                continue;
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
        width: roundToPixels(measureColumn(column), devicePixelRatio)
    }));
}

/**
 * @param {ResolvedColumn[]} columns
 * @param {ResolvedRow[]} rows
 * @param {TextResolver} textResolver
 * @param {FormatResolver} formatResolver
 * @param {RowHeightCache} measuringCache
 * @param {Set<string>} presentKeys
 * @param {number} devicePixelRatio
 * @returns {MeasuredRow[]}
 */
export function getMeasuredRows(columns, rows, textResolver, formatResolver, measuringCache, presentKeys, devicePixelRatio) {
    if (rows.every(row => typeof row.height === 'number'))
        return /** @type {MeasuredRow[]} */ (rows);

    /**
     * @param {ResolvedRow} row
     * @returns {number}
     */
    const measureRow = row => {
        if (row.type === 'DYNAMIC-BLOCK')
            return row.height;

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
            if (column.type === 'DYNAMIC-BLOCK')
                continue;
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
        height: roundToPixels(measureRow(row), devicePixelRatio)
    }));
}