package com.kevinresol.react_native_default_preference;

import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

public class RNDefaultPreferenceModule extends ReactContextBaseJavaModule {
    private String preferencesName;
    private final ReactApplicationContext reactContext;

    public RNDefaultPreferenceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.preferencesName = reactContext.getPackageName() + "_preferences";
    }

    @Override
    public String getName() {
        return "RNDefaultPreference";
    }

    private SharedPreferences getPreferences() {
        return getReactApplicationContext().getSharedPreferences(preferencesName, Context.MODE_PRIVATE);
    }

    @ReactMethod
    public void setName(String name, Promise promise) {
        this.preferencesName = name;
        promise.resolve(null);
    }

    @ReactMethod
    public void getName(Promise promise) {
        promise.resolve(preferencesName);
    }

    @ReactMethod
    public void get(String key, Promise promise) {
        Object value = getPreferences().getAll().get(key);
        if (value instanceof String) {
            promise.resolve((String) value);
        } else if (value instanceof Integer) {
            promise.resolve((Integer) value);
        } else if (value instanceof Boolean) {
            promise.resolve((Boolean) value);
        } else if (value instanceof Float) {
            promise.resolve((Float) value);
        } else if (value instanceof Long) {
            promise.resolve((Long) value);
        } else {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void set(String key, String value, Promise promise) {
        getPreferences().edit().putString(key, value).apply();
        promise.resolve(null);
    }

    @ReactMethod
    public void clear(String key, Promise promise) {
        getPreferences().edit().remove(key).apply();
        promise.resolve(null);
    }

    @ReactMethod
    public void getMultiple(ReadableArray keys, Promise promise) {
        WritableArray result = Arguments.createArray();
        for(int i = 0; i < keys.size(); i++) {
            String key = keys.getString(i);
            Object value = getPreferences().getAll().get(key);
            if (value instanceof String) {
                result.pushString((String) value);
            } else if (value instanceof Integer) {
                result.pushInt((Integer) value);
            } else if (value instanceof Boolean) {
                result.pushBoolean((Boolean) value);
            } else if (value instanceof Float) {
                result.pushDouble((Float) value);
            } else if (value instanceof Long) {
                result.pushDouble((Long) value);
            } else {
                result.pushNull();
            }
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void setMultiple(ReadableMap data, Promise promise) {
        SharedPreferences.Editor editor = getPreferences().edit();
        ReadableMapKeySetIterator iter = data.keySetIterator();
        while(iter.hasNextKey()) {
            String key = iter.nextKey();
            editor.putString(key, data.getString(key));
        }
        editor.apply();
        promise.resolve(null);
    }

    @ReactMethod
    public void clearMultiple(ReadableArray keys, Promise promise) {
        SharedPreferences.Editor editor = getPreferences().edit();
        for(int i = 0; i < keys.size(); i++) {
            editor.remove(keys.getString(i));
        }
        editor.apply();
        promise.resolve(null);
    }

    @ReactMethod
    public void getAll(Promise promise) {
        WritableMap result = Arguments.createMap();
        Map<String, ?> allEntries = getPreferences().getAll();
        for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
            Object value = entry.getValue();
            if (value instanceof String) {
                result.putString(entry.getKey(), (String) value);
            } else if (value instanceof Integer) {
                result.putInt(entry.getKey(), (Integer) value);
            } else if (value instanceof Boolean) {
                result.putBoolean(entry.getKey(), (Boolean) value);
            } else if (value instanceof Float) {
                result.putDouble(entry.getKey(), ((Float) value).doubleValue());
            } else if (value instanceof Long) {
                result.putDouble(entry.getKey(), ((Long) value).doubleValue());
            } else {
                result.putNull(entry.getKey());
            }
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void clearAll(Promise promise) {
        SharedPreferences.Editor editor = getPreferences().edit();
        editor.clear();
        editor.apply();
        promise.resolve(null);
    }
}