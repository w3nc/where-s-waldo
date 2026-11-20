// Pure logic: no database, no Express. Easy to test on its own.
//
// x and y are fractions of the image size (0 to 1). The image is wider than
// it is tall (2560 x 1685), so vertical distances are divided by the aspect
// ratio to make the target a true circle on screen.
const ASPECT = 2560 / 1685;

function isHit(point, circle) {
  const distance = Math.hypot(point.x - circle.x, (point.y - circle.y) / ASPECT);
  return distance <= circle.radius;
}

module.exports = { ASPECT, isHit };
