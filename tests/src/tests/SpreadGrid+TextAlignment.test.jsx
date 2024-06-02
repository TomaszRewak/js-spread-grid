import { describe, it, expectScreenshot } from '../test-utils/puppeteerTesting.js';
import SpreadGrid from '../spread-grid.js';

const generateSpreadGrid = (textAlign, textBaseline, text) => {
    return (
        <SpreadGrid
            columns={[
                { id: 0, width: 100 },
                { id: 1, width: 100 },
                { id: 2, width: 100 }
            ]}
            rows={[
                { id: 0, height: 50 },
                { id: 1, height: 50 },
                { id: 2, height: 50 }
            ]}
            data={[
                ['', '', ''],
                ['', text, ''],
                ['', '', '']
            ]}
            formatting={[
                { style: { textAlign, textBaseline } }
            ]}
        />
    );
}

describe('SpreadGrid+textAlignment', () => {
    it('left top',
        () => generateSpreadGrid('left', 'top', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('left middle',
        () => generateSpreadGrid('left', 'middle', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('left bottom',
        () => generateSpreadGrid('left', 'bottom', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center top',
        () => generateSpreadGrid('center', 'top', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center middle',
        () => generateSpreadGrid('center', 'middle', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center bottom',
        () => generateSpreadGrid('center', 'bottom', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right top',
        () => generateSpreadGrid('right', 'top', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right middle',
        () => generateSpreadGrid('right', 'middle', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right bottom',
        () => generateSpreadGrid('right', 'bottom', 'ABCD'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('left top long',
        () => generateSpreadGrid('left', 'top', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('left middle long',
        () => generateSpreadGrid('left', 'middle', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('left bottom long',
        () => generateSpreadGrid('left', 'bottom', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center top long',
        () => generateSpreadGrid('center', 'top', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center middle long',
        () => generateSpreadGrid('center', 'middle', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center bottom long',
        () => generateSpreadGrid('center', 'bottom', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right top long',
        () => generateSpreadGrid('right', 'top', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right middle long',
        () => generateSpreadGrid('right', 'middle', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right bottom long',
        () => generateSpreadGrid('right', 'bottom', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        async page => await expectScreenshot(page, '.spread-grid')
    );
});