import { describe, it, expectScreenshot } from '../test-utils/puppeteerTesting.js';
import SpreadGrid from '../spread-grid.js';

const generateSpreadGrid = (top, middle, bottom, left, center, right) => {
    return (
        <SpreadGrid
            columns={[
                ...new Array(left + center + right).fill(0).map((_, i) => ({ id: i, width: 70 })),
            ]}
            rows={[
                ...new Array(top + middle + bottom).fill(0).map((_, i) => ({ id: i, height: 20 })),
            ]}
            pinnedTop={top}
            pinnedBottom={bottom}
            pinnedLeft={left}
            pinnedRight={right}
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