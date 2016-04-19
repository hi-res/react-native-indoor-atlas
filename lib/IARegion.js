function IARegion(identifier, type, timestamp) {
  Object.defineProperty(
    this,
    'id',
    { value: identifier, enumerable: true }
  )

  Object.defineProperty(
    this,
    'type',
    { value: type, enumerable: true }
  )
  
  Object.defineProperty(
    this,
    'timestamp',
    {
      value: timestamp || null,
      enumerable: true,
      writable: true
    }
  )
}

module.exports = IARegion

