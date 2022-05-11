import mitt from "mitt";

class Tracker {
  //
  // static
  //

  static _EVENT_NAMES = {
    positionUpdate: "positionUpdate",
    errorGettingPosition: "errorGettingPosition"
  };

  static get EVS() {
    return this._EVENT_NAMES;
  }

  static get HAS_GEOLOCATION() {
    return !!navigator.geolocation;
  }

  //
  // instance
  //

  _emitter;
  /** @type {number|null} */
  _watchPositionNumber = null;
  _lastUserPosition = {
    lat: null,
    lng: null
  };

  constructor() {
    this._emitter = mitt();
  }

  get on() {
    return this._emitter.on;
  }

  get off() {
    return this._emitter.off;
  }

  start() {
    if (this._watchPositionNumber !== null) {
      console.warn("star() this._watchPositionNumber !== null", this._watchPositionNumber);
      return;
    }

    /** @type {PositionOptions} */
    //   const options = {
    //     enableHighAccuracy?: boolean;
    //     maximumAge?: number;
    //     timeout?: number;
    // }

    this._watchPositionNumber = window.navigator.geolocation.watchPosition(
      positionCallback => {
        console.debug("positionCallback", positionCallback);
        this._lastUserPosition.lat = positionCallback.coords.latitude;
        this._lastUserPosition.lng = positionCallback.coords.longitude;
        this._emitter.emit(Tracker.EVS.positionUpdate, positionCallback);
      },
      positionErrorCallback => {
        console.debug("positionErrorCallback", positionErrorCallback);
        this._emitter.emit(Tracker.EVS.errorGettingPosition, positionErrorCallback);
      }
    );
    console.debug("Tracker.start() ok!");
  }

  stop() {
    if (this._watchPositionNumber === null) {
      console.debug("stop() this._watchPositionNumber === null");
      return;
    }

    window.navigator.geolocation.clearWatch(this._watchPositionNumber);
    console.debug("Tracker.stop() ok!");
  }

  getCurrentPosition() {
    if (this._watchPositionNumber !== null) {
      return { ...this._lastUserPosition };
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        positionCallback => {
          this._lastUserPosition.lat = positionCallback.coords.latitude;
          this._lastUserPosition.lng = positionCallback.coords.longitude;
          resolve({ ...this._lastUserPosition });
        },
        reject,
        options
      );
    });
  }

  destroy() {
    this._emitter.all.clear();
  }
}

export default Tracker;
