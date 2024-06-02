import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import SpreadGrid from "react-spread-gird";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function YourFirstGrid() {
    return (
        <>
            <SubHeader>First steps</SubHeader>
            <Section>
                <Paragraph>
                    Below you can find a simple example of how to create a grid using the <code>SpreadGrid</code> component.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/your-first-grid/example.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/your-first-grid/example.html').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/your-first-grid/example.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                    />
                </Example>
                <Paragraph>
                    As you can see, it automatically detects columns and rows based on the provided data.
                </Paragraph>
                <Paragraph>
                    It also comes with a default set of behaviors and features like: header generation, cell selection and copying, column resizing, and sorting.
                    We explore how to customize and extend these features throughout the documentation.
                </Paragraph>
            </Section>
        </>
    );
}