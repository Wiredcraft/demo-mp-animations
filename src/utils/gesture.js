const RAD_TO_DEG = Math.PI / 180;

export const GESTURE_TAP = 'TAP';
export const GESTURE_MOVE = 'MOVE';

/**
 * Note that (0,0) is at the upper-left corner.
 */
export function gestureByCoordinates(start, end) {
  if (start.x == null || start.y == null || end.x == null || end.y == null) {
    return {};
  }
  const distanceX = end.x - start.x;
  const distanceY = end.y - start.y;
  // TODO: like this accurate?
  // const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
  const distance = Math.abs(distanceX) + Math.abs(distanceY);
  if (distance < 3) {
    return { type: GESTURE_TAP };
  }
  // TODO: better number?
  if (distance < 6) {
    return {};
  }
  const degree = Math.atan2(distanceX, distanceY) / RAD_TO_DEG;
  if (degree >= 50 && degree <= 130) {
    return { type: GESTURE_MOVE, direction: 'R' };
  }
  if (degree >= -130 && degree <= -50) {
    return { type: GESTURE_MOVE, direction: 'L' };
  }
  if (degree >= -40 && degree <= 40) {
    return { type: GESTURE_MOVE, direction: 'D' };
  }
  if ((degree >= 140 && degree <= 180) || (degree >= -180 && degree <= -140)) {
    return { type: GESTURE_MOVE, direction: 'U' };
  }
  return {};
}

/**
 * Helper.
 */
export function gestureByTouches(start, end) {
  if (!start || !start[0] || !end || !end[0]) {
    return {};
  }
  return gestureByCoordinates(
    {
      x: start[0].pageX,
      y: start[0].pageY
    },
    {
      x: end[0].pageX,
      y: end[0].pageY
    }
  );
}

/**
 * Helper.
 */
export function gestureTapByTouches(start, end) {
  return gestureByTouches(start, end).type === GESTURE_TAP;
}

/**
 * Helper.
 */
export function gestureMoveByTouches(start, end) {
  const gesture = gestureByTouches(start, end);
  if (gesture.type !== GESTURE_MOVE) {
    return {};
  }
  return gesture.direction;
}
