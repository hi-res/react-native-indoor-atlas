function IALocation(latitude, longitude, altitude, floor, region) {
  Object.defineProperty(
    this,
    'latitude',
    { value: latitude, enumerable: true }
  )

  Object.defineProperty(
    this,
    'longitude',
    { value: longitude, enumerable: true }
  )

  Object.defineProperty(
    this,
    'altitude',
    { value: altitude, enumerable: true }
  )
 
  Object.defineProperty(
    this,
    'floor',
    {
      value: floor || null,
      enumerable: true//,
      //writable: true
    }
  ) 
 
  Object.defineProperty(
    this,
    'region',
    {
      value: region || null,
      enumerable: true//,
      //writable: true
    }
  )
}

module.exports = IALocation
