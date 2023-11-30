import StyleResolver from './StyleResolver';

// TODO: add even more test cases
describe('StyleResolver', () => {
  describe('constructor', () => {
    it('should create an empty styleLookup object', () => {
      const resolver = new StyleResolver([]);
      expect(resolver.styleLookup).toEqual(new Map());
    });

    it('should add styles to the styleLookup object', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'red' }) },
        { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => true, style: () => ({ color: 'blue' }) },
      ];
      const resolver = new StyleResolver(styles);
      expect(resolver.styleLookup).toEqual(new Map([
        ['{id:"col1"}:{id:"row1"}', [{ index: 0, condition: styles[0].condition, style: styles[0].style }]],
        ['{id:"col2"}:{id:"row2"}', [{ index: 1, condition: styles[1].condition, style: styles[1].style }]],
      ]));
    });

    it('should handle styles with missing column or row properties', () => {
      const styles = [
        { condition: () => true, style: () => ({ color: 'red' }) },
        { column: { id: 'col1' }, condition: () => true, style: () => ({ color: 'blue' }) },
        { row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'green' }) },
      ];
      const resolver = new StyleResolver(styles);
      expect(resolver.styleLookup).toEqual(new Map([
        ['{match:"ANY"}:{match:"ANY"}', [{ index: 0, condition: styles[0].condition, style: styles[0].style }]],
        ['{id:"col1"}:{match:"ANY"}', [{ index: 1, condition: styles[1].condition, style: styles[1].style }]],
        ['{match:"ANY"}:{id:"row1"}', [{ index: 2, condition: styles[2].condition, style: styles[2].style }]],
      ]));
    });

    it('should handle styles with duplicate cell keys', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'red' }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ color: 'blue' }) },
      ];
      const resolver = new StyleResolver(styles);
      expect(resolver.styleLookup).toEqual(new Map([
        ['{id:"col1"}:{id:"row1"}', [
          { index: 0, condition: styles[0].condition, style: styles[0].style },
          { index: 1, condition: styles[1].condition, style: styles[1].style },
        ]],
      ]));
    });
  });

  describe('resolve', () => {
    it('should return an empty object when no styles are matched', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => false, style: () => ({ color: 'red' }) },
        { column: { id: 'col2' }, row: { id: 'row2' }, condition: () => false, style: () => ({ color: 'blue' }) },
      ];
      const resolver = new StyleResolver(styles);
      const style = resolver.resolve('col3', 3, 'row3', 3, 'value');
      expect(style).toEqual({});
    });

    it('should apply indexing to border styles', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderTop: { width: 1 } }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderLeft: { width: 1 } }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderBottom: { width: 1 } }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: () => true, style: () => ({ borderRight: { width: 1 } }) },
      ];
      const resolver = new StyleResolver(styles);
      const style = resolver.resolve('col1', 1, 'row1', 1, 'value');
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
      const resolver = new StyleResolver(styles);
      const style = resolver.resolve('col1', 1, 'row1', 1, 'value');
      expect(style).toEqual({ color: 'red' });
    });

    it('should use the value for evaluating conditions', () => {
      const styles = [
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: (value) => value === 'value', style: () => ({ color: 'red' }) },
        { column: { id: 'col1' }, row: { id: 'row1' }, condition: (value) => value === 'other', style: () => ({ color: 'blue' }) },
      ];
      const resolver = new StyleResolver(styles);
      const style = resolver.resolve('col1', 1, 'row1', 1, 'value');
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
      const resolver = new StyleResolver(commonStyles);
      const style = resolver.resolve('col3', 3, 'row3', 3, 'value');
      expect(style).toEqual({ color: 'green' });
    });

    it('should use latest matching rule', () => {
      const resolver = new StyleResolver(commonStyles);
      const style = resolver.resolve('col1', 1, 'row1', 1, 'value');
      expect(style).toEqual({ color: 'purple' });
    });

    it('combine styles from multiple rules', () => {
      const resolver = new StyleResolver(commonStyles);
      const style = resolver.resolve('col2', 2, 'row2', 2, 'value');
      expect(style).toEqual({ color: 'brown', background: 'black' });
    });

    it('should use index rules for matching columns and rows by index', () => {
      const resolver = new StyleResolver(commonStyles);
      const style = resolver.resolve('col0', 0, 'row2', 2, 'value');
      expect(style).toEqual({ color: 'orange' });
    });
  });
});