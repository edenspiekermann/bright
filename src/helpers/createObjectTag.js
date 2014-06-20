function createObjectTag(options) {
  var object = document.createElement('object');
  object.className = "BrightcoveExperience";
  for (var param in options) {
    object.appendChild(createParam(param, options[param]));
  }
  return object;
}

function createParam(name, value) {
  var param = document.createElement('param');
  param.name = name;
  param.value = value;
  return param;
}

module.exports = createObjectTag;
