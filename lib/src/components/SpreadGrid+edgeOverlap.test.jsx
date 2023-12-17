import { describe, it, expectScreenshot } from '../utils/puppeteerTesting'
import SpreadGrid from './SpreadGrid';

const generateSpreadGrid = (top, middle, bottom, left, center, right) => {
    return (
        <SpreadGrid
            columnsLeft={[
                ...new Array(left).fill(0).map((_, i) => ({ id: i, width: 70 })),
            ]}
            columns={[
                ...new Array(center).fill(0).map((_, i) => ({ id: i + left, width: 70 })),
            ]}
            columnsRight={[
                ...new Array(right).fill(0).map((_, i) => ({ id: i + left + center, width: 70 })),
            ]}
            rowsTop={[
                ...new Array(top).fill(0).map((_, i) => ({ id: i, height: 20 })),
            ]}
            rows={[
                ...new Array(middle).fill(0).map((_, i) => ({ id: i + top, height: 20 })),
            ]}
            rowsBottom={[
                ...new Array(bottom).fill(0).map((_, i) => ({ id: i + top + middle, height: 20 })),
            ]}
            data={[
                ...new Array(top).fill([
                    ...new Array(left).fill('red'),
                    ...new Array(center).fill('blue'),
                    ...new Array(right).fill('green')
                ]),
                ...new Array(middle).fill([
                    ...new Array(left).fill('yellow'),
                    ...new Array(center).fill('orange'),
                    ...new Array(right).fill('purple')
                ]),
                ...new Array(bottom).fill([
                    ...new Array(left).fill('pink'),
                    ...new Array(center).fill('black'),
                    ...new Array(right).fill('brown')
                ])
            ]}
            formatting={[
                { style: ({ value }) => ({ border: { width: 1, color: value } }) },
            ]}
        />
    );
}

describe('SpreadGrid+edgeOverlap', () => {
    it('all sections 3x3',
        () => generateSpreadGrid(3, 3, 3, 3, 3, 3),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    it('all sections 1x1',
        () => generateSpreadGrid(1, 1, 1, 1, 1, 1),
        async page => await expectScreenshot(page, '.spread-grid')
    );

    for (let i = 0; i < 64; i++) {
        const left = i & 0b000001 ? 2 : 0;
        const center = i & 0b000010 ? 2 : 0;
        const right = i & 0b000100 ? 2 : 0;
        const top = i & 0b001000 ? 2 : 0;
        const middle = i & 0b010000 ? 2 : 0;
        const bottom = i & 0b100000 ? 2 : 0;

        if (left + center + right === 0) continue;
        if (top + middle + bottom === 0) continue;

        it(`top: ${top}, middle: ${middle}, bottom: ${bottom}, left: ${left}, center: ${center}, right: ${right}`,
            () => generateSpreadGrid(top, middle, bottom, left, center, right),
            async page => await expectScreenshot(page, '.spread-grid')
        );
    }
});