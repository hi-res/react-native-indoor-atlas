# React Native IndoorAtlas

IndoorAtlas native plugin for Android. iOS support is currently Work-In-Progress (see: #feature/ios-support branch).


## Table of Contents
0. [Table of Contents](#table-of-contents)
1. [API Documentation](#api-documentation)
  * [IALocationManager](#IALocationManager)
    * [Static Methods](#static-methods)
      * [`getInstance`](#-getinstance-)
    * [Instance Methods](#instance-methods)
      * [`setApiKey`](#-setapikey-apikey-apisecret-)
      * [`on`](#-on-event-listener-)
      * [`off`](#-off-event-listener-)
2. [Quickstart Example](#quickstart-example)


## API Documentation

### IALocationManager
This class provides access to IndoorAtlas location services.

#### Static Methods

##### `getInstance()`
Returns the active `IALocationManager`. If none exists, one is initialized and cached for future calls. This follows the singleton pattern, for the sake of simplicity. That and there wasn't a use case involving multiple instances in this module's original requirements.

#### Instance Methods

##### `setApiKey(apiKey, apiSecret)`
###### Arguments
* `apiKey` : *string* - Your IndoorAtlas API key
* `apiSecret` : *string* - Your IndoorAtlas API secret

This should be called before any other methods. This method is optional on Android if your key/secret are defined in AndroidManifest.xml (see [here](http://docs.indooratlas.com/android/getting-started.html) for more info.)

##### `on(event, listener)`
###### Alias: `addListener(event, listener)`
###### Arguments
* `event` : *string* - An event type from `IndoorAtlas.Events`
* `listener` : *function* - Event listener

Register an event handler `listener` to be called every time the specified `event` is dispatched.
Event data is passed as an argument to the listener function.

##### `once(event, listener)`
###### Alias: `addListener(event, listener)`
###### Arguments
* `event` : *string* - An event type from `IndoorAtlas.Events`
* `listener` : *function* - Event listener

Register an event handler `listener` to be called once, will be called and then unregistered the next time the specified `event` is dispatched.
Event data is passed as an argument to the listener function.

##### `off(event, listener)`
###### Alias: `removeListener(event, listener)`
###### Arguments
* `event` : *string* - An event type from `IndoorAtlas.Events`
* `listener` : *function* - Event listener

Unregister the event handler `listener` for future invocations of the `event` type specified.
#### Events

##### `ON_STATUS_CHANGED`
Dispatched when the location has changed.

##### `ON_CALIBRATION_CHANGED`
Dispatched when there is a change in the calibration quality.

##### `ON_LOCATION_CHANGED`
Dispatched when the location has changed.

##### `ON_ENTER_REGION`
Dispatched when the device enters a mapped region.

##### `ON_EXIT_REGION`
Dispatched when the device exits a mapped region.

## Quickstart Example

```javascript
import IndoorAtlas, { IALocationManager } from 'react-native-indoor-atlas';

const API_KEY = '...',
      API_SECRET = '...';

let locationManager = null

IALocationManager.getInstance()
  .then(lm => locationManager = lm)
  .then(() => locationManager.setApiKey(API_KEY, API_SECRET))
  .then(() => {
    locationManager
      .on(IALocationManager.Events.ON_LOCATION_CHANGED, e => {
        currentLocation = e.location
      })
  })

```
