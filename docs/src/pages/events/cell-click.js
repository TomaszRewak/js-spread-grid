import { useState } from "react";
import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultDictData } from "../../utils/defaults";

export default function CellClickEvents() {
    return (
        <>
            <SubHeader>onCellClick</SubHeader>
            <Section>
                <Paragraph>
                    The <code>onCellClick</code> callback fires whenever a <code>DATA</code> cell is clicked. The callback receives an object with <code>{'{ columnId, rowId }'}</code> to identify the cell, plus a subset of native mouse-event properties: <code>ctrlKey</code>, <code>shiftKey</code>, <code>button</code>, <code>buttons</code>, and <code>detail</code>.
                </Paragraph>
                <Paragraph>
                    The event triggers only for <code>DATA</code> cells - headers, filters, and custom cells are excluded. For <code>CUSTOM</code> cells, use the <code>onCustomCellClick</code> callback instead, which receives the same set of properties.
                </Paragraph>
                <Paragraph>
                    It's recommended to use proper column and row IDs within your grid so that the clicked cell can be identified directly from the callback without referring back to the data.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/cell-click/example.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/cell-click/example.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/cell-click/example.py').default
                    }
                ]} />
                <CellClickExample />
            </Section>
            <SubHeader>Right Click</SubHeader>
            <Section>
                <Paragraph>
                    The grid always suppresses the browser context menu. When no grid context menu is available, right-clicks use the same click logic as left-clicks, including <code>onCellClick</code> and <code>onCustomCellClick</code>. No setting is required.
                </Paragraph>
                <Paragraph>
                    Use <code>button === 2</code> to distinguish a right-click from a left-click (<code>button === 0</code>). When no context menu is available, right-clicking a header sorts it, and right-clicking a toggle-editable cell toggles its value instead of emitting a click callback, just like left-clicking. Focus, selection, resizing, and reordering use the same pointer interactions for both buttons.
                </Paragraph>
                <Paragraph>
                    Cells with nonempty <code>contextMenu</code> formatting open their custom context menu instead of following this click logic. If a cell has no menu items, the behavior above is unchanged.
                </Paragraph>
            </Section>
        </>
    );
}

function CellClickExample() {
    const [selection, setSelection] = useState(null);

    return (
        <>
            <Example>
                <SpreadGrid
                    data={defaultDictData}
                    onCellClick={setSelection}
                />
            </Example>
            <div style={{ marginTop: 12, overflowWrap: 'anywhere' }}>
                <Paragraph>
                    Clicked cell: <code>{selection ? JSON.stringify(selection) : 'None'}</code>
                </Paragraph>
            </div>
        </>
    );
}