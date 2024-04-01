import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import { defaultData } from "../../utils/defaults";

export default function Sorting() {
    return (
        <>
            <Header>Sorting</Header>
            <Paragraph>
                TODO
            </Paragraph>
            <Example>
                <SpreadGrid
                    data={[
                        ...defaultData
                    ]}
                />
            </Example>
        </>
    );
}