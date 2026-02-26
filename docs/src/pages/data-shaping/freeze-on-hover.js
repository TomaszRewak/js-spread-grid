import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { useState, useEffect } from "react";
import { defaultDictData } from "../../utils/defaults";

const sortByAge = [{ columnId: 'age', direction: 'ASC' }];

function randomizeAges(data) {
    const result = {};
    for (const key of Object.keys(data)) {
        result[key] = { ...data[key], age: Math.floor(Math.random() * 50) + 18 };
    }
    return result;
}

function FreezeOnHoverExample() {
    const [data, setData] = useState(() => randomizeAges(defaultDictData));

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => randomizeAges(prev));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <SpreadGrid
            data={data}
            freezeOnHover={true}
            sortBy={sortByAge}
        />
    );
}

function NoFreezeExample() {
    const [data, setData] = useState(() => randomizeAges(defaultDictData));

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => randomizeAges(prev));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <SpreadGrid
            data={data}
            freezeOnHover={false}
            sortBy={sortByAge}
        />
    );
}

export default function FreezeOnHover() {
    return (
        <>
            <SubHeader>Freeze on hover</SubHeader>
            <Section>
                <Paragraph>
                    The <code>freezeOnHover</code> property controls whether the grid freezes the current row and column order while the user's mouse hovers over a data cell. This is useful in scenarios where the data is frequently re-sorted or re-filtered (e.g., live data feeds), preventing the grid layout from jumping around while the user is trying to read or interact with it.
                </Paragraph>
                <Paragraph>
                    When set to <code>true</code>, hovering over any data column or row will cause the grid to keep the previously computed shaped columns and rows, effectively freezing sort and filter results until the mouse leaves. If either <code>sortBy</code> or <code>filters</code> changes while hovering, the freeze is overridden and the new shaping takes effect immediately.
                </Paragraph>
                <Paragraph>
                    The default value is <code>false</code>.
                </Paragraph>
            </Section>

            <SubHeader>Enabled</SubHeader>
            <Section>
                <Paragraph>
                    In the example below, each person's age is randomized every 500 milliseconds, causing the sort-by-age order to change. With <code>freezeOnHover</code> set to <code>true</code>, hover over the grid to freeze the row order in place. Move the mouse away to see it update again.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/freeze-on-hover/enabled.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/freeze-on-hover/enabled.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/freeze-on-hover/enabled.py').default }
                ]} />
                <Example>
                    <FreezeOnHoverExample />
                </Example>
            </Section>

            <SubHeader>Disabled (default)</SubHeader>
            <Section>
                <Paragraph>
                    With <code>freezeOnHover</code> set to <code>false</code> (the default), the grid will always reflect the latest sort and filter results, even while the user hovers over it.
                </Paragraph>
                <Example>
                    <NoFreezeExample />
                </Example>
            </Section>

            <SubHeader>Important note</SubHeader>
            <Section>
                <Paragraph>
                    When <code>freezeOnHover</code> is enabled, the frozen data may reference rows or columns that no longer exist in the current dataset. For example, if a row is removed from the data while the grid is frozen, it will still appear in the grid until the freeze is released. This can result in <code>null</code> or <code>undefined</code> values. It is the user's responsibility to handle such situations appropriately.
                </Paragraph>
            </Section>
        </>
    );
}
