import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import { defaultData } from "../../utils/defaults";
import { useState } from "react";

export default function Sorting() {
    const [sortBy, setSortBy] = useState([{ columnId: "age", direction: "ASC" }]);

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
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                />
            </Example>
        </>
    );
}