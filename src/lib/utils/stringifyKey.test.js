import stringifyKey from './stringifyKey';

describe('stringifyKey', () => {
  it('should stringify a string', () => {
    expect(stringifyKey('hello')).toBe('"hello"');
  });

  it('should stringify a number', () => {
    expect(stringifyKey(123)).toBe('123');
  });

  it('should stringify a boolean', () => {
    expect(stringifyKey(true)).toBe('true');
  });

  it('should stringify an array', () => {
    expect(stringifyKey([1, 'two', { three: 3 }])).toBe('[1,"two",{three:3}]');
  });

  it('should stringify an object with sorted properties', () => {
    expect(stringifyKey({ a: 1, b: 'two', c: { three: 3 } })).toBe('{a:1,b:"two",c:{three:3}}');
  });

  it('should stringify an object with unsorted properties', () => {
    expect(stringifyKey({ b: 'two', a: 1, c: { three: 3 } })).toBe('{a:1,b:"two",c:{three:3}}');
  });
});