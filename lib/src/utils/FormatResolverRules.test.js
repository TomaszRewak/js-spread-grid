import FormatResolver from './FormatResolver';
import stringifyId from './stringifyId';

// TODO: add even more test cases
describe('FormatResolverRules', () => {
  describe('resolve', () => {
    it('should return an empty object when no styles are matched', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => false, style: () => ({ color: 'red' }) },
        { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => false, style: () => ({ color: 'blue' }) },
      ];
      const resolver = new FormatResolver(styles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row3') }, { key: stringifyId('col3') }, null).style;
      expect(style).toEqual({});
    });

    it('should apply indexing to border styles', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderTop: { width: 1 } }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderLeft: { width: 1 } }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderBottom: { width: 1 } }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderRight: { width: 1 } }) },
      ];
      const resolver = new FormatResolver(styles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row1') }, { key: stringifyId('col1') }, null).style;
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
      const resolver = new FormatResolver(styles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row1') }, { key: stringifyId('col1') }, null).style;
      expect(style).toEqual({ color: 'red' });
    });

    it('should use the value for evaluating conditions', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: ({row}) => row.data, style: () => ({ color: 'red' }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: ({row}) => !row.data, style: () => ({ color: 'blue' }) },
      ];
      const resolver = new FormatResolver(styles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row1'), data: true }, { key: stringifyId('col1') }).style;
      expect(style).toEqual({ color: 'red' });
    });

    const commonStyles = [
      { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'red' }) },
      { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => true, style: () => ({ color: 'blue', background: 'black' }) },
      { column: { match: 'ANY' }, row: { match: 'ANY' }, condition: () => true, style: () => ({ color: 'green' }) },
      { column: { id: 'col1' }, row: { match: 'ANY' }, condition: () => true, style: () => ({ color: 'yellow' }) },
      { column: { match: 'ANY' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'purple' }) },
      { column: { match: 'ANY' }, row: { index: 0 }, condition: () => true, style: () => ({ color: 'pink' }) },
      { column: { index: 0 }, row: { match: 'ANY' }, condition: () => true, style: () => ({ color: 'orange' }) },
      { column: { id: 'col2' }, row: { match: 'ANY' }, condition: () => true, style: () => ({ color: 'brown' }) },
    ];

    it('should use ANY rules for matching undefined columns and rows', () => {
      const resolver = new FormatResolver(commonStyles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row3') }, { key: stringifyId('col3') }).style;
      expect(style).toEqual({ color: 'green' });
    });

    it('should use latest matching rule', () => {
      const resolver = new FormatResolver(commonStyles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row1'), index: 1 }, { key: stringifyId('col1'), index: 1 }).style;
      expect(style).toEqual({ color: 'purple' });
    });

    it('combine styles from multiple rules', () => {
      const resolver = new FormatResolver(commonStyles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row2'), index: 2 }, { key: stringifyId('col2'), index: 2 }).style;
      expect(style).toEqual({ color: 'brown', background: 'black' });
    });

    it('should use index rules for matching columns and rows by index', () => {
      const resolver = new FormatResolver(commonStyles);
      const style = resolver.resolve(null, [], [], { key: stringifyId('row2'), index: 2 }, { key: stringifyId('col0'), index: 0 }).style;
      expect(style).toEqual({ color: 'orange' });
    });
  });
});