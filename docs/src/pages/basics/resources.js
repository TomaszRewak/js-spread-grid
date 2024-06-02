import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";

export default function Resources() {
    return (
        <>
            <SubHeader>External Links</SubHeader>
            <Section>
                <Paragraph>
                    You can find the source code of the project and the build artifacts under the following links:
                </Paragraph>
                <Paragraph>
                    <ul>
                        <li>
                            <a href="https://github.com/TomaszRewak/js-spread-grid">GitHub</a>
                        </li>
                        <li>
                            <a href="https://www.npmjs.com/package/js-spread-grid">JS NPM</a>
                        </li>
                        <li>
                            <a href="https://www.npmjs.com/package/react-spread-grid">React NPM</a>
                        </li>
                        <li>
                            <a href="https://pypi.org/project/dash-spread-grid/">Dash PyPi</a>
                        </li>
                    </ul>
                </Paragraph>
            </Section>
        </>
    );
}
