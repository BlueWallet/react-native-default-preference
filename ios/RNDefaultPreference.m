#import "RNDefaultPreference.h"
#import <React/RCTBridgeModule.h>

@implementation RNDefaultPreference

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

RCT_EXPORT_METHOD(getMultiple:(NSArray *)keys
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSMutableArray *result = [NSMutableArray array];
    for(NSString *key in keys) {
        NSString *value = [[self getDefaultUser] stringForKey:key];
        [result addObject: value == nil ? [NSNull null] : value];
    }
    resolve(result);
}

RCT_EXPORT_METHOD(setMultiple:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSUserDefaults *defaults = [self getDefaultUser];
    for (NSString *key in data) {
        [defaults setObject:data[key] forKey:key];
    }
    [defaults synchronize];
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(clearMultiple:(NSArray *)keys
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSUserDefaults *defaults = [self getDefaultUser];
    for (NSString *key in keys) {
        [defaults removeObjectForKey:key];
    }
    [defaults synchronize];
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(getAll:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSDictionary *dictionary = [[self getDefaultUser] dictionaryRepresentation];
    resolve(dictionary);
}

RCT_EXPORT_METHOD(clearAll:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSUserDefaults *defaults = [self getDefaultUser];
    for (NSString *key in [[defaults dictionaryRepresentation] allKeys]) {
        [defaults removeObjectForKey:key];
    }
    [defaults synchronize];
    resolve([NSNull null]);
}

@end