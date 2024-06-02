import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";

export default function Installation() {
    // https://unpkg.com/js-spread-grid@latest/dist/index.js
    return (
        <>
            <SubHeader>React.js</SubHeader>
            <Section>
                <Paragraph>
                    For React applications, the recommended way of installing the library is via <code>npm</code>.
                </Paragraph>
                <Paragraph>
                    <code>npm install react-spread-grid</code>
                </Paragraph>
                <Paragraph>
                    It will add the library to your <code>package.json</code> file and make it available through the <code>react-spread-grid</code> module.
                </Paragraph>
            </Section>
            <SubHeader>Vanilla javascript</SubHeader>
            <Section>
                <Paragraph>
                    For vanilla JavaScript applications, you can include the library directly from a CDN.
                </Paragraph>
                <Paragraph>
                    <code>https://unpkg.com/js-spread-grid@latest/dist/index.js</code>
                </Paragraph>
                <Paragraph>
                    It will make the <code>SpreadGrid</code> function available globally.
                </Paragraph>
                <Paragraph>
                    It's recommended to use a specific version of the library instead of the <code>latest</code> tag.
                </Paragraph>
            </Section>
            <SubHeader>Python Dash</SubHeader>
            <Section>
                <Paragraph>
                    For Python Dash applications, the recommended way of installing the library is via <code>pip</code>.
                </Paragraph>
                <Paragraph>
                    <code>pip install dash-spread-grid</code>
                </Paragraph>
                <Paragraph>
                    It will make the <code>SpreadGrid</code> component available through the <code>dash_spread_grid</code> module.
                </Paragraph>
                <Paragraph>
                    It's recommended to also add the library to your <code>requirements.txt</code> file (or any other dependency management file your project uses).
                </Paragraph>
            </Section>
        </>
    );
}