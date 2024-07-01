import Edition from './Edition.js';
import FormattingRules from './FormattingRules.js';
import stringifyId from '../core-utils/stringifyId.js';

function createEntry(id, type) {
    return {
        key: stringifyId(id),
        id,
        index: -1,
        type: 'DATA',
        labels: []
    };
}

// TODO: add even more test cases
describe('FormattingRules', () => {
    describe('resolve', () => {
        it('should return an empty object when no styles are matched', () => {
            const styles = [
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => false, style: () => ({ color: 'red' }) },
                { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => false, style: () => ({ color: 'blue' }) },
            ];
            const resolver = new FormattingRules(styles);
            const style = resolver.resolve(null, [], [], createEntry('row3'), createEntry('col3'), new Edition([])).style;
            expect(style).toEqual({});
        });

        it('should apply indexing to border styles', () => {
            const styles = [
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderTop: { width: 1 } }) },
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderLeft: { width: 1 } }) },
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderBottom: { width: 1 } }) },
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderRight: { width: 1 } }) },
            ];
            const resolver = new FormattingRules(styles);
            const style = resolver.resolve(null, [], [], createEntry('row1'), createEntry('col1'), new Edition([])).style;
            expect(style).toEqual({
                borderTop: { width: 1, index: 0 },
                borderLeft: { width: 1, index: 1 },
                borderBottom: { width: 1, index: 2 },
                borderRight: { width: 1, index: 3 },
            });
        });

        it('should only apply rules for which the condition is true', () => {
            const styles = [
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'red' }) },
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => false, style: () => ({ color: 'blue' }) },
            ];
            const resolver = new FormattingRules(styles);
            const style = resolver.resolve(null, [], [], createEntry('row1'), createEntry('col1'), new Edition([])).style;
            expect(style).toEqual({ color: 'red' });
        });

        it('should use the value for evaluating conditions', () => {
            const styles = [
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: ({ row }) => row.metadata, style: () => ({ color: 'red' }) },
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: ({ row }) => !row.metadata, style: () => ({ color: 'blue' }) },
            ];
            const resolver = new FormattingRules(styles);
            const style = resolver.resolve(null, [], [], { ...createEntry('row1'), metadata: true }, { ...createEntry('col1') }, new Edition([])).style;
            expect(style).toEqual({ color: 'red' });
        });

        const commonStyles = [
            { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'red' }) },
            { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => true, style: () => ({ color: 'blue', background: 'black' }) },
            { column: { type: 'ANY' }, row: { type: 'ANY' }, condition: () => true, style: () => ({ color: 'green' }) },
            { column: { id: 'col1' }, row: { type: 'ANY' }, condition: () => true, style: () => ({ color: 'yellow' }) },
            { column: { type: 'ANY' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'purple' }) },
            { column: { type: 'ANY' }, row: { index: 0 }, condition: () => true, style: () => ({ color: 'pink' }) },
            { column: { index: 0 }, row: { type: 'ANY' }, condition: () => true, style: () => ({ color: 'orange' }) },
            { column: { id: 'col2' }, row: { type: 'ANY' }, condition: () => true, style: () => ({ color: 'brown' }) },
        ];

        it('should use ANY rules for matching undefined columns and rows', () => {
            const resolver = new FormattingRules(commonStyles);
            const style = resolver.resolve(null, [], [], createEntry('row3'), createEntry('col3'), new Edition([])).style;
            expect(style).toEqual({ color: 'green' });
        });

        it('should use latest matching rule', () => {
            const resolver = new FormattingRules(commonStyles);
            const style = resolver.resolve(null, [], [], { ...createEntry('row1'), index: 1 }, { ...createEntry('col1'), index: 1 }, new Edition([])).style;
            expect(style).toEqual({ color: 'purple' });
        });

        it('combine styles from multiple rules', () => {
            const resolver = new FormattingRules(commonStyles);
            const style = resolver.resolve(null, [], [], { ...createEntry('row2'), index: 2 }, { ...createEntry('col2'), index: 2 }, new Edition([])).style;
            expect(style).toEqual({ color: 'brown', background: 'black' });
        });

        it('should use index rules for matching columns and rows by index', () => {
            const resolver = new FormattingRules(commonStyles);
            const style = resolver.resolve(null, [], [], { ...createEntry('row2'), index: 2 }, { ...createEntry('col0'), index: 0 }, new Edition([])).style;
            expect(style).toEqual({ color: 'orange' });
        });
    });
});