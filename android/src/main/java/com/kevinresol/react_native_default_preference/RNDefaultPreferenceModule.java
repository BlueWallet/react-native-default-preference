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

public class RNDefaultPreferenceModule extends ReactContextBaseJavaModule {
    private String preferencesName;
    private final SharedPreferences.OnSharedPreferenceChangeListener preferenceChangeListener;
    private final ReactApplicationContext reactContext;

    public RNDefaultPreferenceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.preferencesName = reactContext.getPackageName() + "_preferences";

        preferenceChangeListener = (sharedPreferences, key) -> {
            if (reactContext.hasActiveCatalystInstance()) {
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
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        getPreferences().unregisterOnSharedPreferenceChangeListener(preferenceChangeListener);
    }

    private SharedPreferences getPreferences() {
        return getReactApplicationContext().getSharedPreferences(preferencesName, Context.MODE_PRIVATE);
    }}

    private SharedPreferences.Editor getEditor() {
        return getPreferences().edit();
    }

  private void resolvePreferenceValue(Object value, Promise promise) {
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

  private WritableMap resolvePreferenceToMap(String key, Object value) {
    WritableMap map = Arguments.createMap();
    if (value instanceof String) {
      map.putString(key, (String) value);
    } else if (value instanceof Integer) {
      map.putInt(key, (Integer) value);
    } else if (value instanceof Boolean) {
      map.putBoolean(key, (Boolean) value);
    } else if (value instanceof Float) {
      map.putDouble(key, (Float) value);
    } else if (value instanceof Long) {
      map.putDouble(key, ((Long) value).doubleValue());
    }
    return map;
  }
}