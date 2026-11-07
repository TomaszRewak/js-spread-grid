import { useState } from "react";
import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultDictData } from "../../utils/defaults";

export default function ContextMenus() {
    return (
        <>
            <SubHeader>Context Menus</SubHeader>
            <Section>
                <Paragraph>
                    Add <code>contextMenu</code> to a formatting rule to define actions available when a cell is right-clicked. An entry is an object with an <code>id</code> and HTML <code>content</code>, or the string <code>'separator'</code>. A rule can supply one entry, an array, or a function returning either. Only use trusted HTML in <code>content</code>.
                </Paragraph>
                <Paragraph>
                    Matching rules append their entries in formatting order rather than replacing earlier entries. Leading, trailing, and consecutive separators are omitted. Items can also have <code>disabled</code> and <code>className</code> properties.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/context-menus/example.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/context-menus/example.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/context-menus/example.py').default }
                ]} />
                <ContextMenuExample />
            </Section>

            <SubHeader>Selection And Timing</SubHeader>
            <Section>
                <Paragraph>
                    <code>onContextMenuSelect</code> receives <code>{'{ id, columnId, rowId }'}</code> when an enabled item is selected. Menu functions receive the usual formatting context, including <code>value</code>, <code>text</code>, and <code>newValue</code>, and run only when a context menu is requested. The menu entries, cell identity, and callback are captured when it opens; later data or formatting changes do not update the open menu.
                </Paragraph>
                <Paragraph>
                    A nonempty menu takes priority over <code>enableRightClick</code>. If no items remain, the grid follows its normal right-click behavior, including the browser context menu when <code>enableRightClick</code> is false. Positioning uses the same flip-and-snap logic as tooltips, but is calculated only once. Outside clicks, Escape, scrolling outside the menu, and viewport resizing dismiss it. Arrow keys navigate items, and Enter or Space selects one.
                </Paragraph>
                <Paragraph>
                    In Dash, use <code>context_menu</code> inside formatting rules. Objects and arrays are passed directly; strings other than <code>'separator'</code> are JavaScript expressions evaluated with the formatting context. Selections update <code>selected_context_menu_item</code> with the same IDs and an incrementing <code>n</code> counter, so repeated selections can trigger callbacks.
                </Paragraph>
            </Section>

            <SubHeader>Styling</SubHeader>
            <Section>
                <Paragraph>
                    The popup uses <code>.spread-grid-context-menu</code>, its buttons use <code>.spread-grid-context-menu-item</code>, and separators use <code>.spread-grid-context-menu-separator</code>. Default styles have zero specificity, so ordinary CSS selectors can override them. An item's <code>className</code> adds your own styling hook without removing the default class.
                </Paragraph>
            </Section>
        </>
    );
}

function ContextMenuExample() {
    const [selection, setSelection] = useState(null);

    return (
        <>
            <Example>
                <SpreadGrid
                    data={defaultDictData}
                    formatting={[
                        {
                            column: { type: 'DATA' },
                            row: { type: 'DATA' },
                            contextMenu: ['separator', { id: 'inspect', content: 'Inspect cell' }, 'separator']
                        },
                        {
                            column: { type: 'DATA' },
                            row: { type: 'DATA' },
                            contextMenu: ({ value }) => [
                                'separator',
                                { id: 'use-value', content: '<strong>Use value</strong>' },
                                {
                                    id: 'double',
                                    content: typeof value === 'number' ? `Double ${value}` : 'Double number',
                                    disabled: typeof value !== 'number'
                                },
                                'separator'
                            ]
                        }
                    ]}
                    onContextMenuSelect={setSelection}
                />
            </Example>
            <div style={{ marginTop: 12, overflowWrap: 'anywhere' }}>
                <Paragraph>
                    Selected action: <code>{selection ? JSON.stringify(selection) : 'None'}</code>
                </Paragraph>
            </div>
        </>
    );
}