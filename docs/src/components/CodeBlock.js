import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python'
import './CodeBlock.css';
import './CodeBlockTheme.css';
import { defaultDataCode, defaultDictDataCode, incompleteDataCode } from '../utils/defaults';


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


function CodeBlockBody({ code, framework, replace }) {
    if (typeof code !== 'string')
        return null;

    const lines = Object
        .entries(replace || {})
        .reduce((acc, [from, to]) => acc.replace(from, to), code)
        .split('\n');
    const blocks = [[]];

    const pushCollapse = (value) => {
        blocks.push([]);
        blocks.at(-1).collapse = value;
    };

    const pushCode = (line, code) => {
        const indent = line.match(/^\s*/)[0];
        const dataLines = code[framework];
        for (const dataLine of dataLines)
            blocks.at(-1).push(indent + dataLine);
    };

    for (const line of lines) {
        if (['// collapse: true', '# collapse: true'].includes(line.trim())) {
            pushCollapse(true);
        } else if (['// collapse: false', '# collapse: false'].includes(line.trim())) {
            pushCollapse(false);
        } else if (['// default data', '# default data'].includes(line.trim())) {
            pushCode(line, defaultDataCode);
        } else if (['// default dict data', '# default dict data'].includes(line.trim())) {
            pushCode(line, defaultDictDataCode);
        } else if (['// incomplete data', '# incomplete data'].includes(line.trim())) {
            pushCode(line, incompleteDataCode);
        } else {
            blocks.at(-1).push(line);
        }
    }

    for (const block of blocks) {
        for (let i = 0; i < block.length; i++) {
            block[i] = block[i]
                .replace(/ {4}/g, '  ')
                .replace('  # type: ignore', '')
                .replace(' // eslint-disable-line', '');
        }
    }

    const language = getLanguage(framework);
    const grammar = getGrammar(framework);
    const htmlBlocks = blocks
        .filter(block => block.length > 0)
        .map(block => Prism.highlight(block.join('\n'), Prism.languages[grammar], language));

    return (
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
    );
}

function SeparatorElement({ separator }) {
    return <div>{separator || '↓'}</div>
}

function Separator({ separator }) {
    return (
        <div className='CodeBlock-arrows'>
            {Array(20).fill().map((_, i) => <SeparatorElement separator={separator} key={i} />)}
        </div>
    );
}

export default function CodeBlock({ options, separator }) {
    const [framework, setFramework] = React.useState(options[0].framework);
    const { code, equivalentCode, replace } = options.find(option => option.framework === framework);

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
            <CodeBlockBody code={code} framework={framework} replace={replace} />
            {equivalentCode && (
                <>
                    <Separator separator={separator} />
                    <CodeBlockBody code={equivalentCode} framework={framework} replace={replace} />
                </>
            )}
        </div>
    );
}