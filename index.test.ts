import { NativeModules, Platform } from 'react-native';
import DefaultPreference from './index';

const mockDefaultPreference = require('./__mocks__/react-native-default-preference');

const { RNDefaultPreference } = NativeModules;

jest.mock('react-native', () => {
  const mockDefaultPreference = require('./__mocks__/react-native-default-preference');
  return {
    NativeModules: {
      RNDefaultPreference: {
        setName: mockDefaultPreference.setName,
        getName: mockDefaultPreference.getName,
        get: mockDefaultPreference.get,
        set: mockDefaultPreference.set,
        clear: mockDefaultPreference.clear,
        getMultiple: mockDefaultPreference.getMultiple,
        setMultiple: mockDefaultPreference.setMultiple,
        clearMultiple: mockDefaultPreference.clearMultiple,
        getAll: mockDefaultPreference.getAll,
        clearAll: mockDefaultPreference.clearAll,
      },
    },
    Platform: {
      OS: 'ios', // Default to iOS; will override in tests
    },
  };
});

describe.each(['ios', 'android'])('DefaultPreference on %s', (platform) => {
  beforeAll(() => {
    // Override Platform.OS for each test suite
    (Platform as any).OS = platform;
  });

  let defaultPref: DefaultPreference;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mockPreferences by clearing all data for 'default' suite
    RNDefaultPreference.clearAll('default');
    defaultPref = new DefaultPreference();
  });

  it('should set and get a value for the default instance', async () => {
    await defaultPref.set('key1', 'value1');
    const value = await defaultPref.get('key1');
    expect(value).toBe('value1');
  });

  it('should set and get a value for the group instance', async () => {
    const groupPref = new DefaultPreference('group.reactnative.example');
    await groupPref.set('key1', 'value1');
    const value = await groupPref.get('key1');
    expect(value).toBe('value1');
  });

  it('should clear a value for the default instance', async () => {
    await defaultPref.set('key2', 'value2');
    await defaultPref.clear('key2');
    const value = await defaultPref.get('key2');
    expect(value).toBeNull();
  });

  it('should clear a value for the group instance', async () => {
    const groupPref = new DefaultPreference('group.reactnative.example');
    await groupPref.set('key2', 'value2');
    await groupPref.clear('key2');
    const value = await groupPref.get('key2');
    expect(value).toBeNull();
  });

  it('should set and get multiple values for the default instance', async () => {
    const data = { key3: 'value3', key4: 'value4' };
    await defaultPref.setMultiple(data);
    const values = await defaultPref.getMultiple(['key3', 'key4']);
    expect(values).toEqual(['value3', 'value4']);
  });

  it('should clear multiple values for the default instance', async () => {
    const data = { key5: 'value5', key6: 'value6' };
    await defaultPref.setMultiple(data);
    await defaultPref.clearMultiple(['key5', 'key6']);
    const values = await defaultPref.getMultiple(['key5', 'key6']);
    expect(values).toEqual([null, null]);
  });

  it('should get all values for the default instance', async () => {
    const data = { key7: 'value7', key8: 'value8' };
    await defaultPref.setMultiple(data);
    const allValues = await defaultPref.getAll();
    expect(allValues).toEqual(data);
  });

  it('should clear all values for the default instance', async () => {
    const data = { key9: 'value9', key10: 'value10' };
    await defaultPref.setMultiple(data);
    await defaultPref.clearAll();
    const allValues = await defaultPref.getAll();
    expect(allValues).toEqual({});
  });

  it('should not set the name if no name is provided', () => {
    const instance = new DefaultPreference();
    expect(RNDefaultPreference.setName).not.toHaveBeenCalled();
  });

  it('should set the name if a name is provided', () => {
    const instance = new DefaultPreference('group.reactnative.example');
    expect(RNDefaultPreference.setName).toHaveBeenCalledWith('group.reactnative.example');
  });

  it('should not call setName if name is default', () => {
    new DefaultPreference();
    expect(RNDefaultPreference.setName).not.toHaveBeenCalled();
  });

  it('should call setName if name is not default', () => {
    new DefaultPreference('customName');
    expect(RNDefaultPreference.setName).toHaveBeenCalledWith('customName');
  });
});