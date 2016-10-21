/**
 * @providesModule ReactNativeIndoorAtlas
 * @flow
 */
'use strict'

const NativeModules = require('react-native').NativeModules,
      IANative = NativeModules.RNIA

//var warning = require('fbjs/lib/warning')


var ReactNativeIndoorAtlas = {
  IALocationManager: require('./lib/IALocationManager'),
  IALocationManagerEvents: require('./lib/IALocationManagerEvents'),
  getVersion: function() {
    return IANative.getVersion()
  }
}

module.exports = ReactNativeIndoorAtlas

