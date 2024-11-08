#import "RNDefaultPreference.h"
#import <React/RCTEventEmitter.h>

@implementation RNDefaultPreference

NSString* defaultSuiteName = nil;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (NSUserDefaults *) getDefaultUser{
    if(defaultSuiteName == nil){
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

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onPreferenceChange"];
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
    NSUserDefaults *defaults = [self getDefaultUser];
    NSDictionary *changedKeys = defaults.dictionaryRepresentation;
    
    [changedKeys enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
        NSDictionary *changeInfo = @{@"key": key, @"value": obj};
        [self sendEventWithName:@"onPreferenceChange" body:changeInfo];
    }];
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_METHOD(set:(NSString *)key value:(id)value
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if ([value isKindOfClass:[NSString class]]) {
        [[self getDefaultUser] setObject:value forKey:key];
    } else if ([value isKindOfClass:[NSNumber class]]) {
        [[self getDefaultUser] setObject:value forKey:key];
    }
    [[self getDefaultUser] synchronize];
    resolve([NSNull null]);
}


RCT_EXPORT_METHOD(setName:(NSString *)name
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    defaultSuiteName = name;
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(getName:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    resolve(defaultSuiteName);
}

RCT_EXPORT_METHOD(get:(NSString *)key
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    id value = [[self getDefaultUser] objectForKey:key];
    if ([value isKindOfClass:[NSString class]]) {
        resolve(value);
    } else if ([value isKindOfClass:[NSNumber class]]) {
        resolve([NSString stringWithFormat:@"%@", value]);
    } else if ([value isKindOfClass:[NSArray class]] || [value isKindOfClass:[NSDictionary class]]) {
        NSError *error;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:value options:0 error:&error];
        if (!jsonData) {
            reject(@"error_serializing", @"Could not serialize JSON data", error);
        } else {
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            resolve(jsonString);
        }
    } else {
        resolve([NSNull null]);
    }
}

RCT_EXPORT_METHOD(set:(NSString *)key value:(id)value
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    if ([value isKindOfClass:[NSString class]]) {
        [[self getDefaultUser] setObject:value forKey:key];
    } else if ([value isKindOfClass:[NSNumber class]]) {
        [[self getDefaultUser] setObject:value forKey:key];
    } else if ([value isKindOfClass:[NSArray class]] || [value isKindOfClass:[NSDictionary class]]) {
        [[self getDefaultUser] setObject:value forKey:key];
    }
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(clear:(NSString *)key
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    [[self getDefaultUser] removeObjectForKey:key];
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(getMultiple:(NSArray *)keys
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    NSMutableArray *result = [NSMutableArray array];
    for (NSString *key in keys) {
        id value = [[self getDefaultUser] objectForKey:key];
        if ([value isKindOfClass:[NSString class]] || [value isKindOfClass:[NSNumber class]]) {
            [result addObject:value];
        } else if ([value isKindOfClass:[NSArray class]] || [value isKindOfClass:[NSDictionary class]]) {
            NSError *error;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:value options:0 error:&error];
            NSString *jsonString = jsonData ? [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] : [NSNull null];
            [result addObject:jsonString];
        } else {
            [result addObject:[NSNull null]];
        }
    }
    resolve(result);
}

RCT_EXPORT_METHOD(setMultiple:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    for (id key in data) {
        id value = data[key];
        [[self getDefaultUser] setObject:value forKey:key];
    }
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(clearMultiple:(NSArray *)keys
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    for (NSString *key in keys) {
        [[self getDefaultUser] removeObjectForKey:key];
    }
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(getAll:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    NSArray *keys = [[[self getDefaultUser] dictionaryRepresentation] allKeys];
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    for (NSString *key in keys) {
        id value = [[self getDefaultUser] objectForKey:key];
        if ([value isKindOfClass:[NSString class]] || [value isKindOfClass:[NSNumber class]]) {
            result[key] = value;
        } else if ([value isKindOfClass:[NSArray class]] || [value isKindOfClass:[NSDictionary class]]) {
            NSError *error;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:value options:0 error:&error];
            result[key] = jsonData ? [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] : [NSNull null];
        } else {
            result[key] = [NSNull null];
        }
    }
    resolve(result);
}

RCT_EXPORT_METHOD(clearAll:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSArray *keys = [[[self getDefaultUser] dictionaryRepresentation] allKeys];
    [self clearMultiple:keys resolve:resolve reject:reject];
}

@end