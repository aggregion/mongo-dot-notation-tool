/**
 * @param {*} value Value
 * @return {Boolean}
 */
function isObject(value) {
  return value && value.toString() === '[object Object]';
}

/**
 * @param {*} value Value
 * @return {Boolean}
 */
function isArray(value) {
  return Array.isArray(value);
}

/**
 * @param {Object|Array} value Input value
 * @return {Object|Array}
 */
function decode(value) {
  if (!isObject(value) && !isArray(value)) {
    return value;
  }

  var result = {};

  Object.keys(value).forEach(function(path) {
    var parts = path.split('.');
    var val = value[path];
    var part;

    if (parts.length === 1) {
      result[path] = val;

      if (isArray(val)) {
        result[path] = val.map(decode);
      } else if (isObject(val)) {
        result[path] = decode(val);
      }
    }

    var tmp = result;

    for (var i = 0; i < parts.length; i++) {
      part = parts[i];
      var nextPart = parts[i + 1];

      if (nextPart) {
        if (!tmp[part]) {
          tmp[part] = {};
        }

        if (!tmp[part][nextPart]) {
          tmp[part][nextPart] = {};
        }

        tmp = tmp[part];
      } else {
        if (isArray(val)) {
          tmp[part] = val.map(decode);
        } else if (isObject(val)) {
          tmp[part] = decode(val);
        } else {
          tmp[part] = val;
        }

        break;
      }
    }
  });

  return result;
}

/**
 * @param {Object} value Input value
 * @param {Array} keyChain Key chain
 * @param {Object|Array} result Result value
 * @return {Object|Array}
 */
function encode(value, keyChain, result) {
  if (!keyChain) {
    keyChain = [];
  }

  var _key;
  var _o;

  if (isArray(value)) {
    if (!result) {
      result = [];
    }

    for (var i = 0; i < value.length; i++) {
      var cond = value[i];

      if (isArray(cond)) {
        result[i] = [];
        encode(cond, [], result[i]);
      } else if (isObject(cond)) {
        result[i] = {};
        encode(cond, [], result[i]);
      } else {
        result[i] = cond;
      }
    }
  } else if (isObject(value)) {
    if (!result) {
      result = {};
    }

    Object.keys(value).forEach(function(key) {
      var _keyChain = [].concat(keyChain);
      _keyChain.push(key);

      if (key.charAt(0) === '$') {
        if (isArray(value[key])) {
          _o = {};
          _o[key] = encode(value[key]);
          if (keyChain && keyChain.length) {
            result[keyChain.join('.')] = _o;
          } else {
            Object.assign(result, _o);
          }
        } else if (isObject(value[key])) {
          if (keyChain.length) {
            _key = keyChain.join('.');
            if (!result[_key]) {
              result[_key] = {};
            }
            encode(value[key], [key], result[_key]);
          } else {
            encode(value[key], [key], result);
          }
        } else {
          _key = keyChain.join('.');
          _o = {};
          _o[key] = value[key];
          if (result[_key]) {
            Object.assign(result[_key], _o);
          } else {
            result[_key] = _o;
          }
        }
      } else {
        if (isArray(value[key])) {
          _key = _keyChain.join('.');
          result[_key] = [];
          encode(value[key], [], result[_key]);
        } else if (isObject(value[key])) {
          encode(value[key], _keyChain, result);
        } else {
          result[_keyChain.join('.')] = value[key];
        }
      }
    });
  } else {
    result = value;
  }

  return result;
}

module.exports.encode = encode;
module.exports.decode = decode;
