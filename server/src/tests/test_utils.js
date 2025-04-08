
function isValidObject(obj, keys, types) {
    if (keys.length !== types.length) return false;

    return keys.every((key, index) => {
      return (
        Object.hasOwn(obj, key) &&
        typeof obj[key] === types[index]
      );
    });
}

function checkEnums(obj, key_name, valid_values) {
    return valid_values.includes(obj[key_name])
}

module.exports = {
    isValidObject,
    checkEnums
  };
