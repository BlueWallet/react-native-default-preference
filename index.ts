import { NativeModules } from 'react-native';

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
    return RNDefaultPreference.get(this.name, key);
  }

  async set(key: string, value: string | number | boolean): Promise<void> {
    return RNDefaultPreference.set(this.name, key, value);
  }

  async clear(key: string): Promise<void> {
    return RNDefaultPreference.clear(this.name, key);
  }

  async getMultiple(keys: string[]): Promise<(string | number | boolean | null)[]> {
    return RNDefaultPreference.getMultiple(this.name, keys);
  }

  async setMultiple(data: RNDefaultPreferenceKeys): Promise<void> {
    return RNDefaultPreference.setMultiple(this.name, data);
  }

  async clearMultiple(keys: string[]): Promise<void> {
    return RNDefaultPreference.clearMultiple(this.name, keys);
  }

  async getAll(): Promise<RNDefaultPreferenceKeys> {
    return RNDefaultPreference.getAll(this.name);
  }

  async clearAll(): Promise<void> {
    return RNDefaultPreference.clearAll(this.name);
  }

  async getName(): Promise<string> {
    return this.name;
  }
}

export default DefaultPreference;