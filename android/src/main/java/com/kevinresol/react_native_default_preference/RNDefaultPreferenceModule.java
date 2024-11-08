package com.kevinresol.react_native_default_preference;

import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Map;

public class RNDefaultPreferenceModule extends ReactContextBaseJavaModule {
    private String preferencesName;
    private final SharedPreferences.OnSharedPreferenceChangeListener preferenceChangeListener;
    private final ReactApplicationContext reactContext;
    private boolean hasListeners = false;  // Flag to track if listeners are active

    public RNDefaultPreferenceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.preferencesName = reactContext.getPackageName() + "_preferences";

        preferenceChangeListener = (sharedPreferences, key) -> {
            if (hasListeners && reactContext.hasActiveCatalystInstance()) {  // Only send events if listeners are active
                WritableMap changeInfo = Arguments.createMap();
                changeInfo.putString("key", key);
                Object value = sharedPreferences.getAll().get(key);

                if (value instanceof String) {
                    changeInfo.putString("value", (String) value);
                } else if (value instanceof Integer) {
                    changeInfo.putInt("value", (Integer) value);
                } else if (value instanceof Boolean) {
                    changeInfo.putBoolean("value", (Boolean) value);
                } else if (value instanceof Float) {
                    changeInfo.putDouble("value", ((Float) value).doubleValue());
                } else if (value instanceof Long) {
                    changeInfo.putDouble("value", ((Long) value).doubleValue());
                } else {
                    changeInfo.putNull("value");
                }

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onPreferenceChange", changeInfo);
            }
        };

        getPreferences().registerOnSharedPreferenceChangeListener(preferenceChangeListener);
    }

    @Override
    public String getName() {
        return "RNDefaultPreference";
    }

    @Override
    public void initialize() {
        super.initialize();
        hasListeners = true;  // Mark that listeners are active when the module is initialized
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        hasListeners = false;  // Mark that no listeners are active when the module is destroyed
        getPreferences().unregisterOnSharedPreferenceChangeListener(preferenceChangeListener);
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
}