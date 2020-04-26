// no easing, no acceleration
export const linear = function(t) {
  return t;
};
// accelerating from zero velocity
export const easeInQuad = function(t) {
  return t * t;
};
// decelerating to zero velocity
export const easeOutQuad = function(t) {
  return t * (2 - t);
};
// acceleration until halfway, then deceleration
export const easeInOutQuad = function(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
// accelerating from zero velocity
export const easeInCubic = function(t) {
  return t * t * t;
};
// decelerating to zero velocity
export const easeOutCubic = function(t) {
  return --t * t * t + 1;
};
// acceleration until halfway, then deceleration
export const easeInOutCubic = function(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};
// accelerating from zero velocity
export const easeInQuart = function(t) {
  return t * t * t * t;
};
// decelerating to zero velocity
export const easeOutQuart = function(t) {
  return 1 - --t * t * t * t;
};
// acceleration until halfway, then deceleration
export const easeInOutQuart = function(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
};
// accelerating from zero velocity
export const easeInQuint = function(t) {
  return t * t * t * t * t;
};
// decelerating to zero velocity
export const easeOutQuint = function(t) {
  return 1 + --t * t * t * t * t;
};
// acceleration until halfway, then deceleration
export const easeInOutQuint = function(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
};
