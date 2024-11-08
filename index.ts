import { NativeEventEmitter, NativeModules } from 'react-native';

const { RNDefaultPreference } = NativeModules;
const preferenceEmitter = new NativeEventEmitter(RNDefaultPreference);

export interface RNDefaultPreferenceKeys {
  [key: string]: string | number | boolean | string[] | null;
}

class DefaultPreference {
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
    return RNDefaultPreference.getName();
  }

  static async setName(name: string): Promise<void> {
    return RNDefaultPreference.setName(name);
  }

  static addPreferenceListener(callback: (key: string, value: any) => void): { remove: () => void } {
    const subscription = preferenceEmitter.addListener('onPreferenceChange', (event) => {
      callback(event.key, event.value);
    });
    return { remove: () => subscription.remove() };
  }

  static removePreferenceListener(subscription: { remove: () => void }): void {
    subscription.remove();
  }
}

export default DefaultPreference;