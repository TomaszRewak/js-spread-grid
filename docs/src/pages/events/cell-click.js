import WorkInProgress from "../../components/WorkInProgress";
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
            <WorkInProgress step="implementation" details="working on adding more details to the click events" />
            <SubHeader>onCellClick</SubHeader>
            <Section>
                <Paragraph>
                    The <code>onCellClick</code> callback is invoked whenever a <code>DATA</code> cell is clicked within the grid. The function is invoked with an object containing <code>{'{ columnId, rowId }'}</code> properties (that will allow you to identify the clicked cell). In the future, more fields will be added to the callback event (such as modifier keys).
                </Paragraph>
                <Paragraph>
                    The <code>onCellClick</code> event triggers only for <code>DATA</code> cells, meaning it does not trigger for headers, filters, nor custom cells. For <code>CUSTOM</code> cells, you can register an <code>onCustomCellClick</code> callback that will be invoked whenever those are clicked.
                </Paragraph>
                <Paragraph>
                    It's recommended to use proper column and row IDs within your grid - in order to be able to identify the clicked cell more easily (without having to refer back to the data).
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