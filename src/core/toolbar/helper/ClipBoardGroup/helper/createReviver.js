export const createReviver = (moddle) => {
  var elCache = {};
  return function (key, object) {
    if (typeof object === 'object' && typeof object.$type === 'string') {
      var objectId = object.id;
      if (objectId && elCache[objectId]) {
        return elCache[objectId];
      }
      var type = object.$type;
      var attrs = Object.assign({}, object);
      delete attrs.$type;
      var newEl = moddle.create(type, attrs);
      if (objectId) {
        elCache[objectId] = newEl;
      }
      return newEl;
    }
    return object;
  };
};