import Edition from './Edition.js';
import FormattingRules from './FormattingRules.js';
import stringifyId from '../core-utils/stringifyId.js';

/**
 * @param {Id} id
 * @returns {ResolvedColumn & ResolvedRow}
 */
function createEntry(id) {
    return {
        id: id,
        key: stringifyId(id),
        index: -1,
        type: 'DATA',
        labels: [],
        pinned: null,
        width: 20,
        height: 20,
    };
}

// TODO: add even more test cases
describe('FormattingRules', () => {
    describe('resolve', () => {
        it('should return an empty object when no styles are matched', () => {
            const styles = [
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => false, style: () => ({ foreground: 'red' }) },
                { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => false, style: () => ({ foreground: 'blue' }) },
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
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ foreground: 'red' }) },
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => false, style: () => ({ foreground: 'blue' }) },
            ];
            const resolver = new FormattingRules(styles);
            const style = resolver.resolve(null, [], [], createEntry('row1'), createEntry('col1'), new Edition([])).style;
            expect(style).toEqual({ foreground: 'red' });
        });

        it('should use the value for evaluating conditions', () => {
            /** @type {Rule[]} */
            const styles = [
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: ({ row }) => row.metadata, style: () => ({ foreground: 'red' }) },
                { column: { id: 'col1' }, row: { id: 'row1' }, condition: ({ row }) => !row.metadata, style: () => ({ foreground: 'blue' }) },
            ];
            const resolver = new FormattingRules(styles);
            const style = resolver.resolve(null, [], [], { ...createEntry('row1'), metadata: true }, { ...createEntry('col1') }, new Edition([])).style;
            expect(style).toEqual({ foreground: 'red' });
        });

        /** @type {Rule[]} */
        const commonStyles = [
            { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ foreground: 'red' }) },
            { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => true, style: () => ({ foreground: 'blue', background: 'black' }) },
            { column: { type: 'ANY' }, row: { type: 'ANY' }, condition: () => true, style: () => ({ foreground: 'green' }) },
            { column: { id: 'col1' }, row: { type: 'ANY' }, condition: () => true, style: () => ({ foreground: 'yellow' }) },
            { column: { type: 'ANY' }, row: { id: 'row1' }, condition: () => true, style: () => ({ foreground: 'purple' }) },
            { column: { id: 'col2' }, row: { type: 'ANY' }, condition: () => true, style: () => ({ foreground: 'brown' }) },
        ];

        it('should use ANY rules for matching undefined columns and rows', () => {
            const resolver = new FormattingRules(commonStyles);
            const style = resolver.resolve(null, [], [], createEntry('row3'), createEntry('col3'), new Edition([])).style;
            expect(style).toEqual({ foreground: 'green' });
        });

        it('should use latest matching rule', () => {
            const resolver = new FormattingRules(commonStyles);
            const style = resolver.resolve(null, [], [], { ...createEntry('row1'), index: 1 }, { ...createEntry('col1'), index: 1 }, new Edition([])).style;
            expect(style).toEqual({ foreground: 'purple' });
        });

        it('combine styles from multiple rules', () => {
            const resolver = new FormattingRules(commonStyles);
            const style = resolver.resolve(null, [], [], { ...createEntry('row2'), index: 2 }, { ...createEntry('col2'), index: 2 }, new Edition([])).style;
            expect(style).toEqual({ foreground: 'brown', background: 'black' });
        });
    });
});