#import "RNDefaultPreference.h"
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@implementation RNDefaultPreference {
    BOOL hasListeners;
}

NSString* defaultSuiteName = nil;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (NSUserDefaults *)getDefaultUser {
    if (defaultSuiteName == nil) {
        return [NSUserDefaults standardUserDefaults];
    } else {
        return [[NSUserDefaults alloc] initWithSuiteName:defaultSuiteName];
    }
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

// Implement required method for RCTEventEmitter
- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onPreferenceChange"];
}

// Called when the first listener is added
- (void)startObserving {
    hasListeners = YES;
}

// Called when the last listener is removed or when the module is deallocated
- (void)stopObserving {
    hasListeners = NO;
}

- (instancetype)init
{
    if (self = [super init]) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(userDefaultsDidChange:)
                                                     name:NSUserDefaultsDidChangeNotification
                                                   object:nil];
    }
    return self;
}

- (void)userDefaultsDidChange:(NSNotification *)notification
{
    if (hasListeners) { // Only send events if there are listeners
        NSUserDefaults *defaults = [self getDefaultUser];
        NSDictionary *changedKeys = defaults.dictionaryRepresentation;

        for (NSString *key in changedKeys) {
            id value = [defaults objectForKey:key];
            NSDictionary *changeInfo = @{@"key": key, @"value": value ?: [NSNull null]};
            [self sendEventWithName:@"onPreferenceChange" body:changeInfo];
        }
    }
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_METHOD(setName:(NSString *)name
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    defaultSuiteName = name;
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(getName:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    resolve(defaultSuiteName);
}

RCT_EXPORT_METHOD(get:(NSString *)key
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    id value = [[self getDefaultUser] objectForKey:key];
    resolve(value ?: [NSNull null]);
}

RCT_EXPORT_METHOD(set:(NSString *)key value:(id)value
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSUserDefaults *defaults = [self getDefaultUser];
    [defaults setObject:value forKey:key];
    [defaults synchronize];
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(clear:(NSString *)key
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[self getDefaultUser] removeObjectForKey:key];
    resolve([NSNull null]);
}

@end