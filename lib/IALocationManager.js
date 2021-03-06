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

function IALocationManager() {
  const events = this.events = new EventEmitter()

  bindNativeListeners(events)
}

IALocationManager.prototype.on = eventEmitterFn('addListener')
IALocationManager.prototype.addListener = eventEmitterFn('addListener')
IALocationManager.prototype.once = eventEmitterFn('once')
IALocationManager.prototype.removeAllListeners = eventEmitterFn('removeAllListeners')

IALocationManager.prototype.setApiKey = function(apiKey, apiSecret) {
  if (Platform.OS === 'android') return;

  return IANative.setApiKey(apiKey, apiSecret)
}

IALocationManager.prototype.destroy = function() {
  if (Platform.OS === 'ios') return

  IANative.destroyLocationManager()
}

IALocationManager.prototype.stop = function() {
  return IANative.stop()
}

IALocationManager.prototype.start = function() {
  return IANative.start()
}

IALocationManager.prototype.getFloorplan = function(id) {
  return IANative.getFloorplan(id)
}

IALocationManager.prototype.getLocation = function(location) {
  if (Platform.OS === 'android') return new Promise.reject("Only 'works' on iOS");

  return IANative.getLocation()
    .then(loc => IARegion.fromObject(loc))
}

IALocationManager.prototype.setLocationById = function(locationId) {
  return IANative.setLocationById(locationId)
}

IALocationManager.prototype.setLocation = function(locationId) {
  return IANative.setLocation()
}

IALocationManager.getInstance = (() => {
  var lmInstance = null

  return () => {
    if (lmInstance !== null) return lmInstance
    return lmInstance = new IALocationManager()
  }
})()


module.exports = {
  getInstance: IALocationManager.getInstance,
  Events: IALocationManagerEvents
}
