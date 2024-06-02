import { Component } from "react";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import SpreadGrid from "react-spread-gird";
import SubHeader from "../../components/SubHeader";
import { defaultData, defaultDataCode } from "../../utils/defaults";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return {};
    }

    render() {
        return this.props.children;
    }
}

export default function ErrorOverlay() {
    return (
        <>
            <SubHeader>Rendering errors</SubHeader>
            <Paragraph>
                If an exception is thrown while rendering the grid, the grid will not be rendered and the error (together with the stack trace) will be displayed instead.
            </Paragraph>
            <CodeBlock options={[
                {
                    framework: 'jsx',
                    code: require('!!raw-loader!./snippets/error-overlay/render.jsx').default
                },
                {
                    framework: 'js',
                    code: require('!!raw-loader!./snippets/error-overlay/render.js').default
                },
                {
                    framework: 'py',
                    code: require('!!raw-loader!./snippets/error-overlay/render.py').default
                }
            ]} />
            <Example>
                <ErrorBoundary>
                    <SpreadGrid
                        data={defaultData}
                        formatting={[
                            {
                                style: () => { throw new Error('This is an error') }
                            }
                        ]}
                    />
                </ErrorBoundary>
            </Example>
            <SubHeader>Pre-render errors</SubHeader>
            <Paragraph>
                The same applies to the pre-render errors, that happen during the data processing.
            </Paragraph>
            <CodeBlock options={[
                {
                    framework: 'jsx',
                    code: require('!!raw-loader!./snippets/error-overlay/pre-render.jsx').default
                },
                {
                    framework: 'js',
                    code: require('!!raw-loader!./snippets/error-overlay/pre-render.js').default
                },
                {
                    framework: 'py',
                    code: require('!!raw-loader!./snippets/error-overlay/pre-render.py').default
                }
            ]} />
            <Example>
                <ErrorBoundary>
                    <SpreadGrid
                        data={defaultData}
                        formatting='not an array'
                    />
                </ErrorBoundary>
            </Example>
            <SubHeader>Event-based errors</SubHeader>
            <Paragraph>
                Finally, if an error occurs when handling an event, the same mechanism applies.
            </Paragraph>
            <CodeBlock options={[
                {
                    framework: 'jsx',
                    code: require('!!raw-loader!./snippets/error-overlay/event.jsx').default
                },
                {
                    framework: 'js',
                    code: require('!!raw-loader!./snippets/error-overlay/event.js').default
                }
            ]} />
            <Example>
                <ErrorBoundary>
                    <SpreadGrid
                        data={defaultData}
                        onCellClick={() => { throw new Error('This is an error') }}
                    />
                </ErrorBoundary>
            </Example>
        </>
    );
}