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