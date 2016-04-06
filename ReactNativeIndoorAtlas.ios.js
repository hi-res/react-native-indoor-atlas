/**
 * @providesModule ReactNativeIndoorAtlas
 * @flow
 */
'use strict';

var NativeReactNativeIndoorAtlas = require('NativeModules').ReactNativeIndoorAtlas;

/**
 * High-level docs for the ReactNativeIndoorAtlas iOS API can be written here.
 */

var ReactNativeIndoorAtlas = {
  test: function() {
    NativeReactNativeIndoorAtlas.test();
  }
};

module.exports = ReactNativeIndoorAtlas;
