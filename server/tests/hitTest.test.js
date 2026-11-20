const { isHit, ASPECT } = require('../utils/hitTest');

const circle = { x: 0.5, y: 0.5, radius: 0.02 };

describe('hitTest (pure logic, no database)', () => {
  test('returns true at the exact centre', () => {
    expect(isHit({ x: 0.5, y: 0.5 }, circle)).toBe(true);
  });

  test('returns true just inside the radius', () => {
    expect(isHit({ x: 0.5 + circle.radius * 0.99, y: 0.5 }, circle)).toBe(true);
  });

  test('returns false just outside the radius', () => {
    expect(isHit({ x: 0.5 + circle.radius * 1.01, y: 0.5 }, circle)).toBe(false);
  });

  test('applies the aspect ratio to vertical distance', () => {
    // A vertical offset of radius * ASPECT is a true circle edge once corrected.
    // Without the correction it would be too far away, so it must be a hit
    // only when we shrink it by the aspect ratio.
    const justInsideVertical = { x: 0.5, y: 0.5 + circle.radius * ASPECT * 0.99 };
    const justOutsideVertical = { x: 0.5, y: 0.5 + circle.radius * ASPECT * 1.01 };
    expect(isHit(justInsideVertical, circle)).toBe(true);
    expect(isHit(justOutsideVertical, circle)).toBe(false);
  });

  test('a vertical offset equal to the radius is a hit (corrected distance is smaller)', () => {
    expect(isHit({ x: 0.5, y: 0.5 + circle.radius }, circle)).toBe(true);
  });
});
