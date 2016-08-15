#import "ReactNativeIndoorAtlas.h"

#import "RCTEventDispatcher.h"

@implementation ReactNativeIndoorAtlas

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(RNIA)

- (instancetype)init
{
    self = [super init];
    if (self) {
        IALocationManager *lm = [IALocationManager new];
        lm.delegate = self;
        self.locationManager = lm;
        self.resourceManager = [IAResourceManager resourceManagerWithLocationManager:lm];
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
    //    [lm setDelegate:self];
    [lm stopUpdatingLocation];
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
    
    resolve([self serializeLocation:loc]);
}

- (NSMutableDictionary *)serializeLocation:(IALocation *)location
{
    NSMutableDictionary* retVal = [NSMutableDictionary dictionary];
    [retVal setValue:[NSNumber numberWithDouble:location.location.altitude] forKey:@"altitude"];
    [retVal setValue:[NSDictionary dictionaryWithObjectsAndKeys:
                      [NSNumber numberWithDouble:location.location.coordinate.latitude], @"latitude",
                      [NSNumber numberWithDouble:location.location.coordinate.longitude], @"longitude",
                      nil]
              forKey:@"coordinates"];
    [retVal setValue:[NSNumber numberWithInteger:location.floor.level] forKey:@"floorLevel"];
    
    [retVal setValue:[self serializeRegion:location.region] forKey:@"region"];
    return retVal;
}

- (NSMutableDictionary *)serializeRegion:(IARegion *)region
{
    
    NSMutableDictionary* retVal = [NSMutableDictionary dictionary];
    [retVal setValue:region.identifier forKey:@"id"];
    [retVal setValue:[NSNumber numberWithInt:region.type] forKey:@"type"];
    [retVal setValue:[NSNumber numberWithDouble:[region.timestamp timeIntervalSince1970]] forKey:@"timestamp"];
    
    return retVal;
    
}

#pragma mark IALocationManagerDelegate Methods

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
           didUpdateLocations:(nonnull NSArray*)locations
{
    NSLog(@"onLocationChanged: %@", locations);
    (void) manager;
    
    IALocation *l = (IALocation*)locations.lastObject;
    
    // The accuracy of coordinate position depends on the placement of floor plan image.
    NSLog(@"position changed to coordinate: %.6f,%.6f", l.location.coordinate.latitude, l.location.coordinate.longitude);
    
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNIA.onLocationChanged"
                                                 body:@{@"status": status}];
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
               didEnterRegion:(nonnull IARegion*)region
{
    NSLog(@"onEnterRegion: %@", region);
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNIA.onEnterRegion"
                                                 body:@{@"status": status}];
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
                didExitRegion:(nonnull IARegion*)region
{
    NSLog(@"onExitRegion: %@", region);
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNIA.onExitRegion"
                                                 body:@{@"status": status}];
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
                statusChanged:(nonnull IAStatus*)status
{
    NSLog(@"statusChanged: %@", status);
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNIA.onStatusChanged"
                                                 body:@{@"status": status}];
}

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
    calibrationQualityChanged:(enum ia_calibration)quality
{
    NSString* sQuality;
    
    switch (quality) {
        case kIACalibrationPoor:
            sQuality = @"POOR";
            break;
        case kIACalibrationGood:
            sQuality = @"GOOD";
            break;
        case kIACalibrationExcellent:
            sQuality = @"EXCELLENT";
            break;
        default:
            sQuality = @"UNKNOWN";
            break;
    }
    
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNIA.onCalibrationChanged"
                                                 body:@{@"quality": sQuality}];
    
    NSLog(@"calibrationQualityChanged: %@", sQuality);
}

@end
