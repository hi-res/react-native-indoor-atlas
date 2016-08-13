#import "ReactNativeIndoorAtlas.h"

@implementation ReactNativeIndoorAtlas

RCT_EXPORT_MODULE(RNIA)

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.locationManager = [IALocationManager new];
        self.locationManager.delegate = self;
        self.resourceManager = [IAResourceManager resourceManagerWithLocationManager:[IALocationManager sharedInstance]];
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
                 andSecret:(NSString*)apiSecret
                 done:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    IALocationManager *lm = self.locationManager;
    [lm setDelegate:self];
    
    NSLog(@"Using API Key: %@", apiKey);
    [lm setApiKey:apiKey andSecret:apiSecret];
    
    [lm startUpdatingLocation];
    resolve(nil);
}

RCT_REMAP_METHOD(start,
                 start:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    [self.locationManager startUpdatingLocation];
    resolve(nil);
}

RCT_REMAP_METHOD(stop,
                 stop:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    [self.locationManager stopUpdatingLocation];
    resolve(nil);
}

RCT_REMAP_METHOD(getLocation,
                 getLocation:(RCTPromiseResolveBlock)resolve
                 orReject:(RCTPromiseRejectBlock)reject)
{
    IALocationManager *lm = self.locationManager;
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

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
           didUpdateLocations:(nonnull NSArray*)locations
{
    NSLog(@"didUpdateLocations: %@", locations);
    (void) manager;
    
    IALocation *l = (IALocation*)locations.lastObject;
    
    // The accuracy of coordinate position depends on the placement of floor plan image.
    NSLog(@"position changed to coordinate: %.6f,%.6f", l.location.coordinate.latitude, l.location.coordinate.longitude);
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
    NSString* sQuality;
    
    switch (quality) {
        case kIACalibrationGood:
            sQuality = @"kIACalibrationGood";
            break;
        case kIACalibrationPoor:
            sQuality = @"kIACalibrationPoor";
            break;
        case kIACalibrationExcellent:
            sQuality = @"kIACalibrationExcellent";
            break;
        default:
            break;
    }
    NSLog(@"calibrationQualityChanged: %@", sQuality);
}

@end
