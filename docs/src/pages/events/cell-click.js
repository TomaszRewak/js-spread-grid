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
                <Example>
                    <CellClickExample />
                </Example>
            </Section>
            <SubHeader>Right Click</SubHeader>
            <Section>
                <Paragraph>
                    Set <code>enableRightClick</code> to <code>true</code> to suppress the browser context menu inside the grid and handle right-clicks through the same click logic as left-clicks, including <code>onCellClick</code> and <code>onCustomCellClick</code>. The option defaults to <code>false</code>, preserving the browser context menu. In Dash, use <code>enable_right_click=True</code>.
                </Paragraph>
                <Paragraph>
                    Use <code>button === 2</code> to distinguish a right-click from a left-click (<code>button === 0</code>). With this option enabled, right-clicking a header sorts it, and right-clicking a toggle-editable cell toggles its value instead of emitting a click callback, just like left-clicking. Focus, selection, resizing, and reordering use the same pointer interactions for both buttons regardless of this option.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/cell-click/right-click.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/cell-click/right-click.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/cell-click/right-click.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultDictData}
                        enableRightClick
                        onCellClick={({ columnId, rowId, button }) => {
                            alert(`${button === 2 ? 'Right' : 'Left'} click:\n[columnId]: ${columnId}\n[rowId]: ${rowId}`);
                        }}
                    />
                </Example>
            </Section>
        </>
    );
}

function CellClickExample() {
    return (
        <SpreadGrid
            data={defaultDictData}
            onCellClick={({ columnId, rowId, ctrlKey, shiftKey, button, buttons, detail }) => {
                alert(`Cell clicked:\n[columnId]: ${columnId}\n[rowId]: ${rowId}\n[ctrlKey]: ${ctrlKey}\n[shiftKey]: ${shiftKey}\n[button]: ${button}\n[buttons]: ${buttons}\n[detail]: ${detail}`);
            }}
        />
    );
}