import { useState } from "react";
import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultDictData } from "../../utils/defaults";

export default function Layout() {
    return (
        <>
            <SubHeader>Layout Management</SubHeader>
            <Section>
                <Paragraph>
                    Right-click a column or row header to hide that dimension, restore a hidden one from the alphabetically sorted Show submenu, or edit the layout. A corner cell that is both a column and row header offers both sets of actions and one Edit layout option. The menu keeps the final visible dimension on each axis so headers remain accessible. Set <code>enableLayoutManagementContextMenu</code> to <code>false</code> to disable these actions without disabling your own formatting-based menus. Custom actions follow the layout actions and a separator.
                </Paragraph>
                <Paragraph>
                    <code>hiddenColumns</code> and <code>hiddenRows</code> contain IDs, not visible indices. Hiding does not remove data. Only explicitly defined dimensions and dimensions expanded from <code>DATA-BLOCK</code> can be hidden; virtualized <code>DYNAMIC-BLOCK</code> indices are unaffected. With controlled properties, update them using <code>onHiddenColumnsChange</code> and <code>onHiddenRowsChange</code>.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/layout/example.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/layout/example.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/layout/example.py').default }
                ]} />
                <LayoutExample />
            </Section>

            <SubHeader>Copy And Apply</SubHeader>
            <Section>
                <Paragraph>
                    Edit layout opens an editable JSON snapshot with <code>version: 1</code>, <code>filters</code>, <code>sortBy</code>, <code>columnsOrder</code>, <code>rowsOrder</code>, <code>columnWidths</code>, <code>rowHeights</code>, <code>hiddenColumns</code>, <code>hiddenRows</code>, and the four <code>pinned*</code> counts. The snapshot contains configuration, not data, formatting functions, or dimension definitions. Reuse it with the same dimension IDs. Copy and Paste use browser clipboard permissions; selecting and copying or pasting the text manually also works.
                </Paragraph>
                <Paragraph>
                    Apply validates the JSON before changing the grid. Unknown fields and unsupported versions are rejected; omitted fields keep their current values. Existing filter, sorting, ordering, sizing, and visibility callbacks are invoked, followed by <code>onLayoutChange(layout)</code>. Controlled React consumers can use that callback to update all layout properties together, including pinning. It fires when applying the editor, not for each individual hide or resize action.
                </Paragraph>
            </Section>

            <SubHeader>Styling</SubHeader>
            <Section>
                <Paragraph>
                    The editor uses <code>.spread-grid-layout-editor</code> and its status line uses <code>.spread-grid-layout-editor-status</code>. Menu and editor icons use <code>.spread-grid-layout-icon</code>. These default styles have zero specificity and can be overridden by ordinary CSS selectors.
                </Paragraph>
            </Section>
        </>
    );
}

function LayoutExample() {
    const [hiddenColumns, setHiddenColumns] = useState(['team', 'registered']);
    const [hiddenRows, setHiddenRows] = useState(['Alice']);
    const [appliedLayout, setAppliedLayout] = useState(null);

    return (
        <>
            <Example>
                <SpreadGrid
                    {...appliedLayout}
                    data={defaultDictData}
                    columns={[{ type: 'HEADER' }, { type: 'DATA-BLOCK' }]}
                    rows={[{ type: 'HEADER' }, { type: 'DATA-BLOCK' }]}
                    hiddenColumns={hiddenColumns}
                    hiddenRows={hiddenRows}
                    onHiddenColumnsChange={setHiddenColumns}
                    onHiddenRowsChange={setHiddenRows}
                    onLayoutChange={({ version, ...layout }) => setAppliedLayout(layout)}
                />
            </Example>
            <div style={{ marginTop: 12, overflowWrap: 'anywhere' }}>
                <Paragraph>Hidden columns: <code>{JSON.stringify(hiddenColumns)}</code>; hidden rows: <code>{JSON.stringify(hiddenRows)}</code>.</Paragraph>
            </div>
        </>
    );
}