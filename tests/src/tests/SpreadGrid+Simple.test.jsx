import { describe, it, expectScreenshot } from '../test-utils/puppeteerTesting';
import SpreadGrid from './SpreadGrid';


describe('SpreadGrid+simple', () => {
    it('simple grid',
        () => {
            return <SpreadGrid
                columns={[
                    { id: 'col1', header: 'Column 1', width: 100 },
                    { id: 'col2', header: 'Column 2', width: 100 },
                    { id: 'col3', header: 'Column 3', width: 100 }
                ]}
                rows={[
                    { id: 0, height: 20 },
                    { id: 1, height: 20 },
                    { id: 2, height: 20 }
                ]}
                data={[
                    { col1: '1', col2: '2', col3: '3' },
                    { col1: '4', col2: '5', col3: '6' },
                    { col1: '7', col2: '8', col3: '9' }
                ]}
            />
        },
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('simple grid with default rows',
        () => {
            return <SpreadGrid
                columns={[
                    { id: 'col1', header: 'Column 1', width: 100 },
                    { id: 'col2', header: 'Column 2', width: 100 },
                    { id: 'col3', header: 'Column 3', width: 100 }
                ]}
                data={[
                    { col1: '1', col2: '2', col3: '3' },
                    { col1: '4', col2: '5', col3: '6' },
                    { col1: '7', col2: '8', col3: '9' }
                ]}
            />
        },
        async page => await expectScreenshot(page, '.spread-grid')
    );
});