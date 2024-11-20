import { NativeModules, Platform } from 'react-native';

const { RNDefaultPreference } = NativeModules;

export interface RNDefaultPreferenceKeys {
  [key: string]: string | number | boolean | string[] | null;
}

class DefaultPreference {
  private readonly name: string;

  constructor(name: string = 'default') {
    this.name = name;
    if (name !== 'default') {
      RNDefaultPreference.setName(name);
    }
  }

  async get(key: string): Promise<string | number | boolean | null> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.getDataStore(this.name, key);
    }
    return RNDefaultPreference.get(this.name, key);
  }

  async set(key: string, value: string | number | boolean): Promise<void> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.setDataStore(this.name, key, value);
    }
    return RNDefaultPreference.set(this.name, key, value);
  }

  async clear(key: string): Promise<void> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.clearDataStore(this.name, key);
    }
    return RNDefaultPreference.clear(this.name, key);
  }

  async getMultiple(keys: string[]): Promise<(string | number | boolean | null)[]> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.getMultipleDataStore(this.name, keys);
    }
    return RNDefaultPreference.getMultiple(this.name, keys);
  }

  async setMultiple(data: RNDefaultPreferenceKeys): Promise<void> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.setMultipleDataStore(this.name, data);
    }
    return RNDefaultPreference.setMultiple(this.name, data);
  }

  async clearMultiple(keys: string[]): Promise<void> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.clearMultipleDataStore(this.name, keys);
    }
    return RNDefaultPreference.clearMultiple(this.name, keys);
  }

  async getAll(): Promise<RNDefaultPreferenceKeys> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.getAllDataStore(this.name);
    }
    return RNDefaultPreference.getAll(this.name);
  }

  async clearAll(): Promise<void> {
    if (Platform.OS === 'android') {
      return RNDefaultPreference.clearAllDataStore(this.name);
    }
    return RNDefaultPreference.clearAll(this.name);
  }

  async getName(): Promise<string> {
    return this.name;
  }
}

export default DefaultPreference;