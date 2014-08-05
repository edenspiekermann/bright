// This prevents throwing an error if code with Object.freeze is executed in Browsers
// that don’t support it.
// Note that this code returns the object without freezing it.

if (!Object.freeze) {
  Object.prototype.freeze = function(object) {
    return object;
  };
}
