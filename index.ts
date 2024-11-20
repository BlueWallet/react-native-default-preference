import { NativeModules } from 'react-native';

const { RNDefaultPreference } = NativeModules;

export interface RNDefaultPreferenceKeys {
  [key: string]: string | number | boolean | string[] | null;
}

class DefaultPreference {
  private static groupName: string = 'default'; // Renamed from 'name' to 'groupName'

  static setGroupName(name: string = 'default') { // Renamed method
    DefaultPreference.groupName = name;
    if (name !== 'default') {
      RNDefaultPreference.setName(name);
    }
  }

  static async get(key: string): Promise<string | number | boolean | null> {
    return RNDefaultPreference.get(DefaultPreference.groupName, key);
  }

  static async set(key: string, value: string | number | boolean): Promise<void> {
    return RNDefaultPreference.set(DefaultPreference.groupName, key, value);
  }

  static async clear(key: string): Promise<void> {
    return RNDefaultPreference.clear(DefaultPreference.groupName, key);
  }

  static async getMultiple(keys: string[]): Promise<(string | number | boolean | null)[]> {
    return RNDefaultPreference.getMultiple(DefaultPreference.groupName, keys);
  }

  static async setMultiple(data: RNDefaultPreferenceKeys): Promise<void> {
    return RNDefaultPreference.setMultiple(DefaultPreference.groupName, data);
  }

  static async clearMultiple(keys: string[]): Promise<void> {
    return RNDefaultPreference.clearMultiple(DefaultPreference.groupName, keys);
  }

  static async getAll(): Promise<RNDefaultPreferenceKeys> {
    return RNDefaultPreference.getAll(DefaultPreference.groupName);
  }

  static async clearAll(): Promise<void> {
    return RNDefaultPreference.clearAll(DefaultPreference.groupName);
  }

  static async getGroupName(): Promise<string> { // Renamed method
    return DefaultPreference.groupName;
  }
}

export default DefaultPreference;