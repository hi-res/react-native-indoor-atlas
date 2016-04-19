#import "ReactNativeIndoorAtlas.h"

@implementation ReactNativeIndoorAtlas

RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[IALocationManager sharedInstance] setDelegate:self];
    }
    return self;
}

RCT_REMAP_METHOD(getVersion,
                 getVersion:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    resolve([IALocationManager versionString]);
}

RCT_REMAP_METHOD(setApiKey,
                 setApiKey:(NSString*)apiKey
                 andSecret:(NSString*)apiSecret)
{
    IALocationManager *lm = [IALocationManager sharedInstance];
    [lm setApiKey:apiKey andSecret:apiSecret];
}

RCT_REMAP_METHOD(start,
                 start:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    IALocationManager *lm = [IALocationManager sharedInstance];
    [lm stopUpdatingLocation];
    resolve(nil);
}

RCT_REMAP_METHOD(stop,
                 stop:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    IALocationManager *lm = [IALocationManager sharedInstance];
    [lm startUpdatingLocation];
    resolve(nil);
}

RCT_REMAP_METHOD(getLocation,
                 getLocation:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    IALocationManager *lm = [IALocationManager sharedInstance];
    IALocation* loc = [lm location];
    
    NSMutableDictionary* retVal = [NSMutableDictionary dictionary];
    [retVal setValue:[NSNumber numberWithDouble:loc.location.altitude] forKey:@"altitude"];
    [retVal setValue:[NSDictionary dictionaryWithObjectsAndKeys:
                      [NSNumber numberWithDouble:loc.location.coordinate.latitude], @"latitude",
                      [NSNumber numberWithDouble:loc.location.coordinate.longitude], @"longitude",
                      nil]
              forKey:@"coordinates"];
    [retVal setValue:[NSNumber numberWithInteger:loc.floor.level] forKey:@"floorLevel"];
    
    NSMutableDictionary* region = [NSMutableDictionary dictionary];
    [region setValue:loc.region.identifier forKey:@"id"];
    [region setValue:[NSNumber numberWithInt:loc.region.type] forKey:@"type"];
    [region setValue:[NSNumber numberWithDouble:[loc.region.timestamp timeIntervalSince1970]] forKey:@"timestamp"];
    [retVal setValue:region forKey:@"region"];
    
    resolve(retVal);
}

RCT_REMAP_METHOD(setLocation,
                 setLocationWithLat:(NSNumber*)lat
                 andLng:(NSNumber*)lng
                 resolve:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    IALocationManager* lm = [IALocationManager sharedInstance];
    IALocation* loc = [lm location];
    resolve(nil);
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
           didUpdateLocations:(nonnull NSArray*)locations
{
    NSLog(@"didUpdateLocations: %@", locations);
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
               didEnterRegion:(nonnull IARegion*)region
{
    NSLog(@"didEnterRegion: %@", region);
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
                didExitRegion:(nonnull IARegion*)region
{
    NSLog(@"didExitRegion: %@", region);
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
                statusChanged:(nonnull IAStatus*)status
{
    NSLog(@"statusChanged: %@", status);
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
    calibrationQualityChanged:(enum ia_calibration)quality
{
    NSLog(@"calibrationQualityChanged: %@", quality);
}

@end
