import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";
import { useMemo } from "react";
import { useState } from "react";

export default function Draw() {
    return (
        <>
            <SubHeader>Draw</SubHeader>
            <Section>
                <Paragraph>
                    The <code>draw</code> property of a formatting rule can be used to provide a function that draws custom shapes within a cell. The drawing is located above the background but below the text content.
                </Paragraph>
                <Paragraph>
                    The <code>draw</code> function accepts the same context as other formatting functions (with one exception): <code>{'{data, rows, columns, row, column, value, newValue, text, ctx}'}</code>. The additional <code>ctx</code> property is a <code>CanvasRenderingContext2D</code>.
                </Paragraph>
                <Paragraph>
                    The <code>ctx</code> is already transposed to the cell location. You can use the <code>column.width</code> and the <code>row.height</code> properties to get the current size of the cell. The <code>draw</code> function is invoked only for visible cells.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/draw/example.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/draw/example.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/draw/example.py').default
                    }
                ]} />
                <Example>
                    <DrawExample />
                </Example>
            </Section>
            <SubHeader>Images</SubHeader>
            <Section>
                <Paragraph>
                    It is even possible to draw images within cells.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/draw/image.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/draw/image.js').default
                    }
                ]} />
                <Example>
                    <ImageExample />
                </Example>
            </Section>
        </>
    );
}

function DrawExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    draw: ({ ctx, value, column, row }) => {
                        const width = column.width - 4;
                        const height = row.height - 4;
                        const barWidth = width * (value / 100);

                        ctx.fillStyle = '#76a9ea';
                        ctx.fillRect(2, 2, barWidth, height);
                    }
                }
            ]}
        />
    );
}

function ImageExample() {
    const [_, setLoaded] = useState(false);
    const image = useMemo(() => {
        const image = new Image();
        image.src = '/logo-small.png';
        image.onload = () => setLoaded(true);
        return image;
    }, []);

    return (
        <SpreadGrid
            columns={[
                { type: 'HEADER' },
                { id: 'image', width: 100 }
            ]}
            rows={[
                { type: 'HEADER' },
                { id: 0, height: 100 },
                { id: 1, height: 50 },
                { id: 2, height: 100 },
                { id: 3, height: 50 },
            ]}
            formatting={[
                {
                    column: { id: 'image' },
                    draw: ({ ctx, column, row }) => {
                        ctx.drawImage(image, 0, 0, column.width, row.height);
                    }
                }
            ]}
        />
    );
}