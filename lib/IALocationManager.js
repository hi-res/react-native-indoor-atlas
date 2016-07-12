const ReactNative = require('react-native'),
      Platform = ReactNative.Platform,
      NativeModules = require('react-native').NativeModules,
      DeviceEventEmitter = require('react-native').DeviceEventEmitter,
      IANative = NativeModules.RNIA,
      EventEmitter = require('eventemitter2').EventEmitter2,

      IALocationManagerEvents = require('./IALocationManagerEvents'),
      EventTransforms = require('./EventTransforms'),
      IAFloor = require('./IAFloor'),
      IALocation = require('./IALocation'),
      IARegion = require('./IARegion')


const eventEmitterFn = function(method) {
  return function() {
    this.events[method].apply(
      this.events,
      [].slice.apply(arguments)
    )
  }
}

function bindNativeListeners(events) {
  Object.keys(IALocationManagerEvents)
    .map(k => IALocationManagerEvents[k])
    .map(ev => {
      const transform = EventTransforms[ev] || EventTransforms.DEFAULT

      const handler = (e) => {
        const eventData = transform(e)
        //console.log('fired event: "'+ev+'" - %o', eventData)
        events.emit.apply(events, [ev, eventData])
      }

      DeviceEventEmitter.addListener(`RNIA.${ev}`, handler)
    })
}

class IALocationManager{
  constructor() {
    const events = this.events = new EventEmitter()

    bindNativeListeners(events)
  }

  on: eventEmitterFn('addListener')
  addListener: eventEmitterFn('addListener')
  once: eventEmitterFn('once')
  removeListener: eventEmitterFn('removeListener')
  off: eventEmitterFn('removeListener')
  removeAllListeners: eventEmitterFn('removeAllListeners')

  setApiKey(apiKey, apiSecret) {
    if (Platform.OS === 'android') return;

    return IANative.setApiKey(apiKey, apiSecret)
  }

  destroy() {
    if (Platform.OS === 'ios') return

    IANative.destroyLocationManager()
  }

  stop() {
    return IANative.stop()
  }

  start() {
    return IANative.start()
  }

  getFloorplan(id) {
    return IANative.getFloorplan(id)
  }

  getLocation(location) {
    if (Platform.OS === 'android') return new Promise.reject("Only 'works' on iOS");

    return IANative.getLocation()
      .then(loc => IARegion.fromObject(loc))
  }

  setLocationById(locationId) {
    return IANative.setLocationById(locationId)
  }

  setLocation(locationId) {
    return IANative.setLocation()
  }
}

IALocationManager.getInstance = (function() {
  var lmInstance = null

  return function() {
    if (lmInstance !== null) return lmInstance
    return lmInstance = new IALocationManager()
  }
}())


module.exports = IALocationManager
