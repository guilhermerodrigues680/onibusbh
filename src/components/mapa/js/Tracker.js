import mitt from "mitt";
import * as geolocHelper from "./geolocation";

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

  //
  // instance
  //

  _emitter;
  /** @type {number|null} */
  _watchPositionNumber = null;

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

  destroy() {
    this._emitter.all.clear();
  }
}

export default Tracker;
