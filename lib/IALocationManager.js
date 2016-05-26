const ReactNative = require('react-native'),
      Platform = ReactNative.Platform,
      NativeModules = require('react-native').NativeModules,
      DeviceEventEmitter = require('react-native').DeviceEventEmitter,
      IANative = NativeModules.ReactNativeIndoorAtlas,
      EventEmitter = require('EventEmitter'),

      IAFloor = require('./IAFloor'),
      IALocation = require('./IALocation'),
      IARegion = require('./IARegion')

const IALocationManagerEvents ={
  ON_ENTER_REGION: 'onEnterRegion',
  ON_EXIT_REGION: 'onExitRegion',
  ON_LOCATION_CHANGED: 'onLocationChanged',
  ON_STATUS_CHANGED: 'onStatusChanged'
}


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
    .map(ev => {
      let handler = () => {
        let args = [].slice.apply(arguments)
        events.emit.apply(ev, args)
      }

      DeviceEventEmitter.addListener(`IALocationManager.${ev}`, handler)
    })
}

function IALocationManager() {
  this.events = new EventEmitter()

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

IALocationManager.prototype.addRegionListener = function(request, listener) {
  //IANative.addRegionListener(regionId)
}

IALocationManager.prototype.removeRegionListener = function(request, listener) {

}

IALocationManager.prototype.stop = function() {
  return IANative.stop()
}

IALocationManager.prototype.start = function() {
  return IANative.start()
}

IALocationManager.prototype.getLocation = function(location) {
  if (Platform.OS === 'android') return new Promise.reject("Only 'works' on iOS");

  return IANative.getLocation()
    .then(function(loc) {
      let coords, floor, region, location
      console.log(loc)
      coords = loc.coordinates
      floor = new IAFloor(loc.floorLevel)
      region = new IARegion(
        loc.region.id,
        loc.region.type,
        loc.region.timestamp
      )

      location = new IALocation(
        coords.latitude,
        coords.longitude,
        loc.altitude,
        floor,
        region
      )

      return location
    })
}

IALocationManager.prototype.setLocationById = function(locationId) {
  return IANative.setLocationById(locationId)
}

IALocationManager.prototype.setLocation = function(locationId) {
  return IANative.setLocation()
}

IALocationManager.prototype.unregisterLocationListener = function(listener) {

}

IALocationManager.getInstance = (function() {
  var lmInstance = null

  return function() {
    if (lmInstance !== null) return lmInstance
    return lmInstance = new IALocationManager()
  }
}())


module.exports = {
  getInstance: IALocationManager.getInstance,
  Events: IALocationManagerEvents
}
