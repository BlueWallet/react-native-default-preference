package com.kevinresol.react_native_default_preference;

import android.content.Context;
import androidx.datastore.core.DataStore;
import androidx.datastore.preferences.core.Preferences;
import androidx.datastore.preferences.core.PreferencesKeys;
import androidx.datastore.preferences.preferencesDataStore;
import androidx.datastore.preferences.core.booleanPreferencesKey;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.Dispatchers;
import kotlinx.coroutines.launch;
import kotlinx.coroutines.flow.first;
import java.util.Map;

public class RNDefaultPreferenceModule extends ReactContextBaseJavaModule {
    private String preferencesName;
    private final ReactApplicationContext reactContext;
    private final DataStore<Preferences> dataStore;

    public RNDefaultPreferenceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.preferencesName = reactContext.getPackageName() + "_preferences";
        this.dataStore = reactContext.createDataStore(name = preferencesName);
    }

    @Override
    public String getName() {
        return "RNDefaultPreference";
    }

    @ReactMethod
    public void setName(String name, Promise promise) {
        if (!this.preferencesName.equals(reactContext.getPackageName() + "_preferences")) {
            this.preferencesName = name;
            this.dataStore = reactContext.createDataStore(name = preferencesName);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void getName(Promise promise) {
        promise.resolve(preferencesName);
    }

    @ReactMethod
    public void get(String key, Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            Preferences preferences = dataStore.data.first();
            Preferences.Key<String> stringKey = PreferencesKeys.stringKey(key);
            Preferences.Key<Boolean> booleanKey = PreferencesKeys.booleanKey(key);
            String stringValue = preferences[stringKey];
            Boolean booleanValue = preferences[booleanKey];
            if (stringValue != null) {
                promise.resolve(stringValue);
            } else if (booleanValue != null) {
                promise.resolve(booleanValue);
            } else {
                promise.resolve(null);
            }
        }
    }

    @ReactMethod
    public void set(String key, String value, Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            Preferences.Key<String> stringKey = PreferencesKeys.stringKey(key);
            dataStore.edit { preferences ->
                preferences[stringKey] = value;
            }
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void setBoolean(String key, boolean value, Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            Preferences.Key<Boolean> booleanKey = PreferencesKeys.booleanKey(key);
            dataStore.edit { preferences ->
                preferences[booleanKey] = value;
            }
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void clear(String key, Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            Preferences.Key<String> dataStoreKey = PreferencesKeys.stringKey(key);
            dataStore.edit { preferences ->
                preferences.remove(dataStoreKey);
            }
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void getMultiple(ReadableArray keys, Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            WritableArray result = Arguments.createArray();
            Preferences preferences = dataStore.data.first();
            for (int i = 0; i < keys.size(); i++) {
                String key = keys.getString(i);
                Preferences.Key<String> stringKey = PreferencesKeys.stringKey(key);
                Preferences.Key<Boolean> booleanKey = PreferencesKeys.booleanKey(key);
                String stringValue = preferences[stringKey];
                Boolean booleanValue = preferences[booleanKey];
                if (stringValue != null) {
                    result.pushString(stringValue);
                } else if (booleanValue != null) {
                    result.pushBoolean(booleanValue);
                } else {
                    result.pushNull();
                }
            }
            promise.resolve(result);
        }
    }

    @ReactMethod
    public void setMultiple(ReadableMap data, Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            dataStore.edit { preferences ->
                ReadableMapKeySetIterator iter = data.keySetIterator();
                while (iter.hasNextKey()) {
                    String key = iter.nextKey();
                    if (data.getType(key) == ReadableType.String) {
                        Preferences.Key<String> stringKey = PreferencesKeys.stringKey(key);
                        preferences[stringKey] = data.getString(key);
                    } else if (data.getType(key) == ReadableType.Boolean) {
                        Preferences.Key<Boolean> booleanKey = PreferencesKeys.booleanKey(key);
                        preferences[booleanKey] = data.getBoolean(key);
                    }
                }
            }
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void clearMultiple(ReadableArray keys, Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            dataStore.edit { preferences ->
                for (int i = 0; i < keys.size(); i++) {
                    Preferences.Key<String> dataStoreKey = PreferencesKeys.stringKey(keys.getString(i));
                    preferences.remove(dataStoreKey);
                }
            }
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void getAll(Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            WritableMap result = Arguments.createMap();
            Preferences preferences = dataStore.data.first();
            for (Map.Entry<String, ?> entry : preferences.asMap().entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                if (value instanceof String) {
                    result.putString(key, (String) value);
                } else if (value instanceof Boolean) {
                    result.putBoolean(key, (Boolean) value);
                } else {
                    result.putNull(key);
                }
            }
            promise.resolve(result);
        }
    }

    @ReactMethod
    public void clearAll(Promise promise) {
        CoroutineScope(Dispatchers.IO).launch {
            dataStore.edit { preferences ->
                preferences.clear();
            }
            promise.resolve(null);
        }
    }
}