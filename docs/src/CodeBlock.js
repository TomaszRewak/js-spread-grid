import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // choose the theme you like
import Typography from '@mui/material/Typography';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const CodeBlock = ({ options }) => {
    const [framework, setFramework] = React.useState(options[0].framework);

    const {code, language, grammar} = options.find(option => option.framework === framework);
    const html = Prism.highlight(code, Prism.languages[grammar], language);

    return (
        <div>
            <ToggleButtonGroup>
                {options.map(option => (
                    <ToggleButton
                        key={option.framework}
                        value={option.framework}
                        selected={framework === option.framework}
                        onClick={() => setFramework(option.framework)}
                        size='small'
                    >
                        {option.framework}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Typography component="pre">
                <code dangerouslySetInnerHTML={{ __html: html }} />
            </Typography>
        </div>
    );
};

export default CodeBlock;