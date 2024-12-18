import { NativeModules } from 'react-native';

const { RNDefaultPreference } = NativeModules;

export interface RNDefaultPreferenceKeys {
  [key: string]: string | number | boolean | string[] | null;
}

class DefaultPreference {
  private static groupName: string = 'default';

  static setName(name: string = 'default') {
    DefaultPreference.groupName = name;
    if (name !== 'default') {
      RNDefaultPreference.setName(name);
    }
  }

  static async get(key: string): Promise<string | number | boolean | null> {
    return RNDefaultPreference.get(key);
  }

  static async set(key: string, value: string | number | boolean): Promise<void> {
    return RNDefaultPreference.set(key, value);
  }

  static async clear(key: string): Promise<void> {
    return RNDefaultPreference.clear(key);
  }

  static async getMultiple(keys: string[]): Promise<(string | number | boolean | null)[]> {
    return RNDefaultPreference.getMultiple(keys);
  }

  static async setMultiple(data: RNDefaultPreferenceKeys): Promise<void> {
    return RNDefaultPreference.setMultiple(data);
  }

  static async clearMultiple(keys: string[]): Promise<void> {
    return RNDefaultPreference.clearMultiple(keys);
  }

  static async getAll(): Promise<RNDefaultPreferenceKeys> {
    return RNDefaultPreference.getAll();
  }

  static async clearAll(): Promise<void> {
    return RNDefaultPreference.clearAll();
  }

  static async getName(): Promise<string> {
    return DefaultPreference.groupName;
  }
}

export default DefaultPreference;