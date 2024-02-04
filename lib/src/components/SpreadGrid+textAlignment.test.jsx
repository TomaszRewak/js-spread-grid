import { describe, it, expectScreenshot } from '../test-utils/puppeteerTesting';
import SpreadGrid from './SpreadGrid';

const generateSpreadGrid = (textAlign, textBaseline) => {
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
                ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
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
        () => generateSpreadGrid('left', 'top'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('left middle',
        () => generateSpreadGrid('left', 'middle'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('left bottom',
        () => generateSpreadGrid('left', 'bottom'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center top',
        () => generateSpreadGrid('center', 'top'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center middle',
        () => generateSpreadGrid('center', 'middle'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('center bottom',
        () => generateSpreadGrid('center', 'bottom'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right top',
        () => generateSpreadGrid('right', 'top'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right middle',
        () => generateSpreadGrid('right', 'middle'),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('right bottom',
        () => generateSpreadGrid('right', 'bottom'),
        async page => await expectScreenshot(page, '.spread-grid')
    );
});