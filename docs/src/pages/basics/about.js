import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";

export default function About() {
    return (
        <>
            <SubHeader>TLDR</SubHeader>
            <Section>
                <Paragraph>
                    <strong>Spread Grid</strong> is a javascript library that allows you to create high performance, customizable, and deeply interactive grid-based applications and visualizations with ease.
                </Paragraph>
                <Paragraph>
                    The main focus of this library is to provide a simple and intuitive API that lets you create complex grid-based <strong>tools</strong>.
                </Paragraph>
                <Paragraph>
                    It's worth noting that the main goal of this library is efficiency, functionality, and performance.
                    It's not necessarily intended for visually-rich and design-oriented applications.
                    By principle it does not provide some of the bells and whistles that other libraries may do, like animations and transitions.
                    Those features were traded off in favor of speed and performance - that are usually more important in case of heavy-duty internal-tooling applications.
                    That being said, visually appealing applications can still be created with this library.
                </Paragraph>
                <Paragraph>
                    The ideal use-case for this framework is for creating data-dense tools that help users to monitor and interact with large amounts of data in real-time systems.
                </Paragraph>
                <Paragraph>
                    The main features of this library include:
                    <ul>
                        <li>fast grid rendering</li>
                        <li>cell styling</li>
                        <li>selection</li>
                        <li>multi-cell copying</li>
                        <li>column and row resizing and reordering</li>
                        <li>in-grid editing</li>
                        <li>data sorting and filtering</li>
                        <li>column and row pinning</li>
                        <li>mouse-based grid interaction with easy cell identification</li>
                    </ul>
                    The full list of capabilities can be found in the following sections of this documentation.
                </Paragraph>
                <Paragraph>
                    You can explore the practical applications of this library by navigating to the <strong>examples</strong> section of this page.
                    A good starting point would be the <a href="/examples/app-manager">App Manager</a>, the <a href="/examples/heatmap">Heatmap</a> and the <a href="/examples/plotter">Plotter</a> examples.
                </Paragraph>
            </Section>
            <SubHeader>Motivation</SubHeader>
            <Section>
                <Paragraph>
                    After multiple years of experience building internal GUI tools and data visualizations for the highly demanding HFT industry, grids and data tables have become the central part of my development toolkit.
                </Paragraph>
                <Paragraph>
                    In the past, I had the pleasure of implementing several grid rendering engines from scratch. They were usually targeting some niche use-cases, with performance always being at the forefront.
                </Paragraph>
                <Paragraph>
                    Ultimately, I've decided to create a library with the sole purpose of providing a simple and efficient way of creating data-dense, high-performance, and heavily-customizable grid-based tools.
                    In short, <strong>something that I would (and will) use myself</strong>.
                </Paragraph>
                <Paragraph>
                    And if, along the way, I can also contribute to the open-source community, then that's even better. Hence, this library, with all of its functionalities, is (and will remain) distributed under the MIT license.
                </Paragraph>
            </Section>
        </>
    );
}