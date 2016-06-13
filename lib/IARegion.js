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

IARegion.fromObject = o => {
  return new IARegion(
    o.id,
    o.type,
    o.timestamp
  )
}

module.exports = IARegion

