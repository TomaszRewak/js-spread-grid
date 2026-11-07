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
                    Add <code>contextMenu</code> to a formatting rule to define actions available when a cell is right-clicked. An entry is an object with HTML <code>content</code> and an optional <code>id</code>, or the string <code>'separator'</code>. A rule can supply one entry, an array, or a function returning either. Only use trusted HTML in <code>content</code>.
                </Paragraph>
                <Paragraph>
                    Matching rules append their entries in formatting order rather than replacing earlier entries. Leading, trailing, and consecutive separators are omitted. Items can also have <code>disabled</code> and <code>className</code> properties.
                </Paragraph>
                <Paragraph>
                    An item's <code>submenu</code> can contain another array of entries. Hover over the item or press Arrow Right to open it; Arrow Left returns to its parent. Leaf items emit their own IDs when provided. An optional per-item <code>onSelect</code> callback overrides <code>onContextMenuSelect</code> for that item in JavaScript and React, so an entry with its own handler does not need an ID. Submenu containers do not need IDs either. Header cells also include the default layout actions unless <code>enableLayoutManagementContextMenu</code> is false.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/context-menus/example.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/context-menus/example.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/context-menus/example.py').default }
                ]} />
                <ContextMenuExample />
            </Section>

            <SubHeader>Nested Menus</SubHeader>
            <Section>
                <Paragraph>
                    Submenus can contain items with their own submenus. This example opens Cell tools, then Copy or Export, then a leaf action. Selecting a leaf closes every menu and reports that leaf's ID with the original cell IDs. Disabled items and separators work at every level.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/context-menus/nested.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/context-menus/nested.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/context-menus/nested.py').default }
                ]} />
                <ContextMenuExample nested />
            </Section>

            <SubHeader>Selection And Timing</SubHeader>
            <Section>
                <Paragraph>
                    <code>onContextMenuSelect</code> receives <code>{'{ id, columnId, rowId }'}</code> when an enabled item without its own handler is selected. Supply an ID to identify the action through this shared callback; <code>id</code> is <code>undefined</code> if omitted. Menu functions receive the usual formatting context, including <code>value</code>, <code>text</code>, and <code>newValue</code>, and run only when a context menu is requested. The menu entries, cell identity, and callback are captured when it opens; later data or formatting changes do not update the open menu.
                </Paragraph>
                <Paragraph>
                    The browser context menu is always suppressed inside the grid. A nonempty grid menu takes priority over the usual right-click logic; if no items remain, the grid handles the right-click like a cell click instead. Positioning uses the same flip-and-snap logic as tooltips, but is calculated only once. Scrolling within any grid or menu keeps the popup open at its original position. Viewport resizing and adding rows do not themselves dismiss it. Scrolling outside grids and menus, outside clicks, Escape, Tab, losing window focus, or removing the grid dismiss it. Arrow keys navigate items, and Enter or Space selects one.
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

function ContextMenuExample({ nested = false }) {
    const [selection, setSelection] = useState(null);

    return (
        <>
            <Example>
                <SpreadGrid
                    data={defaultDictData}
                    formatting={nested ? [
                        {
                            row: { type: 'DATA' },
                            column: { type: 'DATA' },
                            contextMenu: {
                                id: 'tools',
                                content: 'Cell tools',
                                submenu: [
                                    {
                                        id: 'copy', content: 'Copy', submenu: [
                                            { id: 'copy-value', content: 'Value' },
                                            { id: 'copy-ids', content: 'Cell IDs' }
                                        ]
                                    },
                                    {
                                        id: 'export', content: 'Export', submenu: [
                                            { id: 'export-json', content: 'JSON' },
                                            { id: 'export-text', content: 'Text', disabled: true }
                                        ]
                                    },
                                    'separator',
                                    { id: 'inspect', content: 'Inspect cell' }
                                ]
                            }
                        }
                    ] : [
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