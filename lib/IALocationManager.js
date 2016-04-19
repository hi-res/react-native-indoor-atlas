const ReactNative = require('react-native'),
      NativeModules = require('react-native').NativeModules,
      IANative = NativeModules.ReactNativeIndoorAtlas,

      IAFloor = require('./IAFloor'),
      IALocation = require('./IALocation'),
      IARegion = require('./IARegion')



function IALocationManager() {
}

IALocationManager.prototype.setApiKey = function(apiKey, apiSecret) {
  IANative.setApiKey(apiKey, apiSecret)
}

IALocationManager.prototype.destroy = function() {
  if (ReactNative.Platform.OS === 'ios') return

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
  return IANative.getLocation()
    .then(function(loc) {
      let coords, floor, region, location
      
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

IALocationManager.prototype.setLocation = function(location) {
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
  getInstance: IALocationManager.getInstance
}
