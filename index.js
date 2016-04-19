/**
 * @providesModule ReactNativeIndoorAtlas
 * @flow
 */
'use strict'

const NativeModules = require('react-native').NativeModules,
      IANative = NativeModules.ReactNativeIndoorAtlas

//var warning = require('fbjs/lib/warning')

var ReactNativeIndoorAtlas = {
  IALocationManager: require('./lib/IALocationManager.js'),
  getVersion: function() {
    return IANative.getVersion()
  }
}

module.exports = ReactNativeIndoorAtlas

