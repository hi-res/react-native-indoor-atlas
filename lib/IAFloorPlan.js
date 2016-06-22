function IAFloorPlan(
  url,
  bitmapWidth,
  bitmapHeight,
  pixelsToMeters,
  metersToPixels,
  floorLevel,
  bearing,
  widthMeters,
  heightMeters,
  affinePixToWgs,
  affineWgsToPix
) {
  Object.defineProperty(
    this,
    "url",
    { value: url, enumerable: true }
  )

  Object.defineProperty(
    this,
    "bitmapWidth",
    { value: bitmapWidth, enumerable: true }
  )

  Object.defineProperty(
    this,
    "bitmapHeight",
    { value: bitmapHeight, enumerable: true }
  )

  Object.defineProperty(
    this,
    "pixelsToMeters",
    { value: pixelsToMeters, enumerable: true }
  )

  Object.defineProperty(
    this,
    "metersToPixels",
    { value: metersToPixels, enumerable: true }
  )

  Object.defineProperty(
    this,
    "floorLevel",
    { value: floorLevel, enumerable: true }
  )

  Object.defineProperty(
    this,
    "bearing",
    { value: bearing, enumerable: true }
  )

  Object.defineProperty(
    this,
    "widthMeters",
    { value: widthMeters, enumerable: true }
  )

  Object.defineProperty(
    this,
    "heightMeters",
    { value: heightMeters, enumerable: true }
  )

  Object.defineProperty(
    this,
    "affinePixToWgs",
    { value: affinePixToWgs, enumerable: true }
  )

  Object.defineProperty(
    this,
    "affineWgsToPix",
    { value: affineWgsToPix, enumerable: true }
  )
}

IAFloorPlan.fromObject = o => {
  return new IAFloorPlan(
    o.url,
    o.bitmapWidth,
    o.bitmapHeight,
    o.pixelsToMeters,
    o.metersToPixels,
    o.floorLevel,
    o.bearing,
    o.widthMeters,
    o.heightMeters,
    o.affinePixToWgs,
    o.affineWgsToPix
  )
}

module.exports = IAFloorPlan
