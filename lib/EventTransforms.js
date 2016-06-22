const Events = require('./IALocationManagerEvents'),
      IAFloor = require('./IAFloor'),
      IAFloorPlan = require('./IAFloorPlan'),
      IALocation = require('./IALocation'),
      IARegion = require('./IARegion')


let Transforms = {}

Object.defineProperty(
  Transforms,
  Events.ON_LOCATION_CHANGED,
  {
    value: e => ({
      location: IALocation.fromObject(e.location)
    })
  }
)

Object.defineProperty(
  Transforms,
  Events.ON_ENTER_REGION,
  {
    value: e => ({
      region: IARegion.fromObject(e.region),
      floorplan: IAFloorPlan.fromObject(e.floorplan)
    })
  }
)

Object.defineProperty(
  Transforms,
  Events.ON_EXIT_REGION,
  {
    value: e => ({ region: IARegion.fromObject(e.region) })
  }
)

Object.defineProperty(
  Transforms,
  'DEFAULT',
  { value: e => e }
)

module.exports = Transforms
