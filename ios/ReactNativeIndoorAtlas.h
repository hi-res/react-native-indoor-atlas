#import "RCTBridgeModule.h"
@import IndoorAtlas;

@interface ReactNativeIndoorAtlas : NSObject <RCTBridgeModule, IALocationManagerDelegate>

@property (nonatomic, strong) IALocationManager *manager;

- (void) getVersion;
- (void) createLocationManager;

@end

NSDictionary *locationManagerRegistry;
int locationManagerRefCount;