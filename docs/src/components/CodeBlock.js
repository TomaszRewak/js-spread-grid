import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python'
import './CodeBlock.css';
import './CodeBlockTheme.css';


function getLanguage(framework) {
    switch (framework) {
        case 'js':
            return 'javascript';
        case 'jsx':
            return 'jsx';
        case 'py':
            return 'python';
        default:
            throw Error(`unknown framework ${framework}`);
    }
}

function getGrammar(framework) {
    switch (framework) {
        case 'js':
            return 'javascript';
        case 'jsx':
            return 'javascript';
        case 'py':
            return 'python';
        default:
            throw Error(`unknown framework ${framework}`);
    }
}


export default function CodeBlock({ options }) {
    const [framework, setFramework] = React.useState(options[0].framework);

    const { code } = options.find(option => option.framework === framework);
    const blocks = [];
    for (const line of code) {
        if (typeof line === 'string') {
            blocks.at(-1).push(line);
        } else {
            blocks.push([]);
            blocks.at(-1).collapse = line.collapse;
        }
    }
    const language = getLanguage(framework);
    const grammar = getGrammar(framework);
    const htmlBlocks = blocks.map(block => Prism.highlight(block.join('\n'), Prism.languages[grammar], language));

    return (
        <div className='CodeBlock'>
            <div className='CodeBlock-header'>
                {options.map(option => (
                    <button
                        key={option.framework}
                        value={option.framework}
                        className={framework === option.framework ? 'selected' : ''}
                        onClick={() => setFramework(option.framework)}
                        size='small'
                    >
                        <span>example</span>.{option.framework}
                    </button>
                ))}
            </div>
            <pre className='CodeBlock-body'>
                {
                    htmlBlocks.map((block, i) => (
                        <code
                            key={i}
                            tabIndex={-1}
                            dangerouslySetInnerHTML={{ __html: block }}
                            className={blocks[i].collapse ? 'collapse' : ''} />
                    ))
                }
            </pre>
        </div>
    );
}