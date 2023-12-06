import stringifyId from './stringifyId';

describe('stringifyId', () => {
  it('should stringify a string', () => {
    expect(stringifyId('hello')).toBe('"hello"');
  });

  it('should stringify a number', () => {
    expect(stringifyId(123)).toBe('123');
  });

  it('should stringify a boolean', () => {
    expect(stringifyId(true)).toBe('true');
  });

  it('should stringify an array', () => {
    expect(stringifyId([1, 'two', { three: 3 }])).toBe('[1,"two",{three:3}]');
  });

  it('should stringify an object with sorted properties', () => {
    expect(stringifyId({ a: 1, b: 'two', c: { three: 3 } })).toBe('{a:1,b:"two",c:{three:3}}');
  });

  it('should stringify an object with unsorted properties', () => {
    expect(stringifyId({ b: 'two', a: 1, c: { three: 3 } })).toBe('{a:1,b:"two",c:{three:3}}');
  });
});