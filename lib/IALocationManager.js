const NativeModules = require('react-native').NativeModules,
      IANative = NativeModules.IndoorAtlasReactNativePlugin

function IALocationManager(nativeInstance) {
  this.$$nativeInstance = nativeInstance
}

IALocationManager.prototype.destroy = function() {

}

IALocationManager.prototype.registerRegionListener = function() {

}

IALocationManager.prototype.removeLocationUpdates = function(request, listener) {

}

IALocationManager.prototype.requestLocationUpdates = function(request, listener) {

}

IALocationManager.prototype.setLocation = function(location) {

}

IALocationManager.prototype.unregisterLocationListener = function(listener) {

}


IALocationManager.create = function() {
  IANative.createLocationManager()
    .then(nativeLM => new IALocationManager(nativeLM))
}

module.exports = IALocationManager
