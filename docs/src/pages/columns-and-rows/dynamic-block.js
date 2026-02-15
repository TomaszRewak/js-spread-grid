import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { useState, useCallback, useMemo } from 'react';

export default function DynamicBlock() {
    return (
        <>
            <SubHeader>Virtualized rows and columns</SubHeader>
            <Section>
                <Paragraph>
                    The <code>DYNAMIC-BLOCK</code> type generates a fixed number of columns or rows without materializing all of them at once. Unlike <code>DATA-BLOCK</code> which eagerly unfolds every item, <code>DYNAMIC-BLOCK</code> only creates definitions for items that are currently visible within the scroll view. Items outside the viewport are collapsed into padding blocks that preserve the correct scroll dimensions.
                </Paragraph>
                <Paragraph>
                    This makes <code>DYNAMIC-BLOCK</code> suitable for grids with hundreds of thousands of rows or columns - the processing cost stays constant regardless of the total count.
                </Paragraph>
                <Paragraph>
                    Note that the grid never renders items outside the scroll view regardless of how rows and columns are defined - even static and <code>DATA-BLOCK</code> items are skipped during rendering when off-screen. The optimization <code>DYNAMIC-BLOCK</code> provides is avoiding the upfront generation of all definitions, which itself becomes a bottleneck at very large counts.
                </Paragraph>
            </Section>

            <SubHeader>Basic usage</SubHeader>
            <Section>
                <Paragraph>
                    A <code>DYNAMIC-BLOCK</code> requires two properties: <code>type</code> and <code>count</code> (the total number of items). Optionally, you can specify a uniform <code>height</code> (for rows) or <code>width</code> (for columns) - individual sizing is not supported.
                </Paragraph>
                <Paragraph>
                    In the following example, 100,000 rows are created. A <code>selector</code> function maps each item's index to a value, and a <code>dataSelector</code> generates cell contents on the fly. Only the rows within the scroll view are actually processed.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/dynamic-block/basic.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/dynamic-block/basic.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/dynamic-block/basic.py').default }
                ]} />
                <Example maxHeight={300}>
                    <BasicExample />
                </Example>
            </Section>

            <SubHeader>Custom selector and ID</SubHeader>
            <Section>
                <Paragraph>
                    A <code>DYNAMIC-BLOCK</code> accepts any property that a static row or column accepts - values like <code>labels</code> are simply propagated to every generated item. The <code>selector</code> and <code>id</code> properties are special: instead of static values, they are functions that generate a value per item.
                </Paragraph>
                <Paragraph>
                    The <code>selector</code> function receives <code>{"{ index, data }"}</code> and returns the selector for each item. The <code>id</code> function receives <code>{"{ data, selector }"}</code> and returns the ID. By default the selector equals the item's index, and the ID equals the selector.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/dynamic-block/ids.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/dynamic-block/ids.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/dynamic-block/ids.py').default }
                ]} />
                <Example maxHeight={300}>
                    <IdsExample />
                </Example>
            </Section>

            <SubHeader>How it works</SubHeader>
            <Section>
                <Paragraph>
                    The grid never renders items outside the scroll view - this is true for static rows and <code>DATA-BLOCK</code> rows as well. The difference with <code>DYNAMIC-BLOCK</code> is that even the definitions themselves are not generated for off-screen items. No selector is computed, no cell value is resolved, no sizing or sorting logic runs for them. They are replaced by lightweight padding blocks that preserve the correct scroll dimensions.
                </Paragraph>
                <Paragraph>
                    With static or <code>DATA-BLOCK</code> rows, all definitions must exist upfront - the grid needs them for filtering, sorting, and calculating sizes, even if those rows are never rendered. With <code>DYNAMIC-BLOCK</code>, only the visible items (plus any pinned ones) are materialized at any given time, keeping the cost constant regardless of the total count.
                </Paragraph>
            </Section>

            <SubHeader>Active rows</SubHeader>
            <Section>
                <Paragraph>
                    The <code>onActiveRowsChange</code> callback fires whenever the set of active row IDs changes. With <code>DYNAMIC-BLOCK</code> rows, it reports only the rows that are currently visible. Without <code>DYNAMIC-BLOCK</code>, it reports all <code>DATA</code> rows except those removed by filtering. This makes the callback especially useful with <code>DYNAMIC-BLOCK</code> grids, where it can drive lazy data loading: you only fetch data for the rows that are actually on screen.
                </Paragraph>
                <Paragraph>
                    The following example displays the list of active row IDs below the grid, updating live as you scroll.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/dynamic-block/active-rows.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/dynamic-block/active-rows.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/dynamic-block/active-rows.py').default }
                ]} />
                <Example maxHeight={400}>
                    <ActiveRowsExample />
                </Example>
            </Section>

            <SubHeader>Limitations</SubHeader>
            <Section>
                <Paragraph>
                    Because <code>DYNAMIC-BLOCK</code> items are materialized lazily, the grid does not have access to all definitions at once. This introduces some trade-offs compared to <code>DATA-BLOCK</code>:
                </Paragraph>
                <ul>
                    <li><strong>No sorting or filtering</strong> - the built-in sort and filter features require all row and column definitions to be available, which is not the case for <code>DYNAMIC-BLOCK</code>. Items within a <code>DYNAMIC-BLOCK</code> will be skipped by sort and filter operations.</li>
                    <li><strong>Uniform sizing</strong> - all items in a <code>DYNAMIC-BLOCK</code> share the same <code>height</code> (rows) or <code>width</code> (columns). Per-item sizing and <code>"fit"</code> mode are not supported.</li>
                </ul>
                <Paragraph>
                    If your dataset is small enough to be fully materialized, prefer <code>DATA-BLOCK</code> for full sorting, filtering, and per-item sizing support.
                </Paragraph>
            </Section>
        </>
    );
}

function BasicExample() {
    return (
        <SpreadGrid
            columns={[
                { type: 'HEADER' },
                { id: 'value', width: 80 },
                { id: 'square', width: 80 },
                { id: 'cube', width: 80 },
            ]}
            rows={[
                { type: 'HEADER' },
                { type: 'DYNAMIC-BLOCK', count: 100000 },
            ]}
            dataSelector={({ row, column }) => {
                const n = row.selector;
                if (column.selector === 'value') return n;
                if (column.selector === 'square') return n * n;
                if (column.selector === 'cube') return n * n * n;
            }}
            pinnedTop={1}
        />
    );
}

function IdsExample() {
    return (
        <SpreadGrid
            columns={[
                { id: 'label', width: 120 },
                { id: 'index', width: 60 },
            ]}
            rows={[
                { type: 'HEADER' },
                {
                    type: 'DYNAMIC-BLOCK',
                    count: 1000,
                    selector: ({ index }) => index * 10,
                    id: ({ selector }) => `item-${selector}`,
                },
            ]}
            dataSelector={({ row, column }) => {
                if (column.selector === 'label') return `Item at position ${row.selector}`;
                if (column.selector === 'index') return row.selector;
            }}
            pinnedTop={1}
        />
    );
}

function ActiveRowsExample() {
    const [activeRows, setActiveRows] = useState([]);

    const columns = useMemo(() => [
        { id: 'value', width: 80 },
        { id: 'doubled', width: 80 },
    ], []);

    const rows = useMemo(() => [
        { type: 'HEADER' },
        { type: 'DYNAMIC-BLOCK', count: 100000 },
    ], []);

    const dataSelector = useCallback(({ row, column }) => {
        const n = row.selector;
        if (column.selector === 'value') return n;
        if (column.selector === 'doubled') return n * 2;
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', alignItems: 'center', background: '#212228' }}>
            <SpreadGrid
                columns={columns}
                rows={rows}
                dataSelector={dataSelector}
                pinnedTop={1}
                height={200}
                onActiveRowsChange={setActiveRows}
            />
            <div style={{ marginTop: 8, padding: 8, borderRadius: 4, fontSize: 12, fontFamily: 'monospace', color: '#ccc' }}>
                <strong>Active rows ({activeRows.length}):</strong>{' '}
                {activeRows.join(', ')}
            </div>
        </div>
    );
}
