#import "RCTBridgeModule.h"

@import IndoorAtlas;
#import <IndoorAtlas/IndoorAtlas.h>

@interface ReactNativeIndoorAtlas : NSObject <RCTBridgeModule, IALocationManagerDelegate>

- (void)getVersion:(RCTPromiseResolveBlock)resolve
          orReject:(RCTPromiseRejectBlock)reject;

- (void)setApiKey:(NSString*)apiKey
        andSecret:(NSString*)apiSecret;

- (void)start:(RCTPromiseResolveBlock)resolve
     orReject:(RCTPromiseRejectBlock)reject;

- (void)stop:(RCTPromiseResolveBlock)resolve
    orReject:(RCTPromiseRejectBlock)reject;

- (void)getLocation:(RCTPromiseResolveBlock)resolve
           orReject:(RCTPromiseRejectBlock)reject;

- (void)setLocationWithLat:(NSNumber*)lat
                    andLng:(NSNumber*)lng
                   resolve:(RCTPromiseResolveBlock)resolve
                  orReject:(RCTPromiseRejectBlock)reject;


#pragma mark IALocationManagerDelegate Methods

/**
 * Tells the delegate that new location data is available.
 *
 * Implementation of this method is optional but recommended.
 *
 * @param manager The location manager object that generated the update event.
 * @param locations An array of IALocation objects containing the location data. This array always contains at least one object representing the current location.
 * If updates were deferred or if multiple locations arrived before they could be delivered, the array may contain additional entries.
 * The objects in the array are organized in the order in which they occured. Threfore, the most recent location update is at the end of the array.
 */

- (void)indoorLocationManager:(nonnull IALocationManager*)manager
           didUpdateLocations:(nonnull NSArray*)locations;

/**
 * Tells the delegate that the user entered the specified region.
 * @param manager The location manager object that generated the event.
 * @param region The region related to event.
 */
- (void)indoorLocationManager:(nonnull IALocationManager*)manager
               didEnterRegion:(nonnull IARegion*)region;

/**
 * Tells the delegate that the user left the specified region.
 * @param manager The location manager object that generated the event.
 * @param region The region related to event.
 */
- (void)indoorLocationManager:(nonnull IALocationManager*)manager
                didExitRegion:(nonnull IARegion*)region;

/**
 * Tells that IALocationManager status changed. This is used to signal network connection issues.
 * @param manager The location manager object that generated the event.
 * @param status The status at the time of the event.
 */
- (void)indoorLocationManager:(nonnull IALocationManager*)manager
                statusChanged:(nonnull IAStatus*)status;
/**
 * Tells that calibration quality changed.
 * @param manager The location manager object that generated the event.
 * @param quality The calibration quality at the time of the event.
 */
- (void)indoorLocationManager:(nonnull IALocationManager*)manager
    calibrationQualityChanged:(enum ia_calibration)quality;


@end