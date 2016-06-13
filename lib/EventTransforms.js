const Events = require('./IALocationManagerEvents'),
      IAFloor = require('./IAFloor'),
      IALocation = require('./IALocation'),
      IARegion = require('./IARegion')


let Transforms = {}

Object.defineProperty(
  Transforms,
  Events.ON_LOCATION_CHANGED,
  {
    value: (e) => {
      return {
        location: IALocation.fromObject(e.location)
      }
    }
  }
)

Object.defineProperty(
  Transforms,
  Events.ON_ENTER_REGION,
  {
    value: (e) => {
      debugger
      return {

      }
    }
  }
)

Object.defineProperty(
  Transforms,
  Events.ON_EXIT_REGION,
  {
    value: (e) => {
      debugger
      return {

      }
    }
  }
)

Object.defineProperty(
  Transforms,
  'DEFAULT',
  { value: e => e }
)

module.exports = Transforms
