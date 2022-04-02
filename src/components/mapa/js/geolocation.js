const HAS_GEOLOCATION = !!navigator.geolocation;

/**
 * @param {PositionOptions} options
 * @returns {Promise<GeolocationPosition>}
 * @throws GeolocationPositionError
 */
function getCurrentPosition(options = undefined) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function clearWatch(watchId) {
  navigator.geolocation.clearWatch(watchId);
}

/**
 * @param {PositionOptions} options
 */
function watchPosition(options) {
  return new Promise((resolve, reject) => {
    return navigator.geolocation.watchPosition(resolve, reject, options);
  });
}

export { HAS_GEOLOCATION, getCurrentPosition, watchPosition, clearWatch };
