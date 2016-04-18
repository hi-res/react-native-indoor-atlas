#import "ReactNativeIndoorAtlas.h"

@implementation ReactNativeIndoorAtlas

RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    if (self) {
        locationManagerRefCount = 0;
        locationManagerRegistry = [locationManagerRegistry init];
    }
    return self;
}

RCT_EXPORT_METHOD(getVersion)
{
  // Your implementation here
}

RCT_EXPORT_METHOD(createLocationManager)
{
    // Your implementation here
}

@end
