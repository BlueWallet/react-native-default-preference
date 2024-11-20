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

  beforeEach(() => {
    jest.clearAllMocks();
    mockDefaultPreference.reset(); // Reset all mock preferences
    RNDefaultPreference.clearAll(); 
  });

  it('should set and get a value for the default instance', async () => {
    await DefaultPreference.set('key1', 'value1');
    const value = await DefaultPreference.get('key1');
    expect(value).toBe('value1');
  });

  it('should set and get a value for the group instance', async () => {
    await DefaultPreference.setName('group.reactnative.example');
    await DefaultPreference.set('key1', 'value1');
    const value = await DefaultPreference.get('key1');
    expect(value).toBe('value1');
  });

  it('should clear a value for the default instance', async () => {
    await DefaultPreference.set('key2', 'value2');
    await DefaultPreference.clear('key2');
    const value = await DefaultPreference.get('key2');
    expect(value).toBeNull();
  });

  it('should clear a value for the group instance', async () => {
    await DefaultPreference.setName('group.reactnative.example');
    await DefaultPreference.set('key2', 'value2');
    await DefaultPreference.clear('key2');
    const value = await DefaultPreference.get('key2');
    expect(value).toBeNull();
  });

  it('should set and get multiple values for the default instance', async () => {
    const data = { key3: 'value3', key4: 'value4' };
    await DefaultPreference.setMultiple(data);
    const values = await DefaultPreference.getMultiple(['key3', 'key4']);
    expect(values).toEqual(['value3', 'value4']);
  });

  it('should clear multiple values for the default instance', async () => {
    const data = { key5: 'value5', key6: 'value6' };
    await DefaultPreference.setMultiple(data);
    await DefaultPreference.clearMultiple(['key5', 'key6']);
    const values = await DefaultPreference.getMultiple(['key5', 'key6']);
    expect(values).toEqual([null, null]);
  });

  it('should get all values for the default instance', async () => {
    const data = { key7: 'value7', key8: 'value8' };
    await DefaultPreference.setMultiple(data);
    const allValues = await DefaultPreference.getAll();
    expect(allValues).toEqual(data);
  });

  it('should clear all values for the default instance', async () => {
    const data = { key9: 'value9', key10: 'value10' };
    await DefaultPreference.setMultiple(data);
    await DefaultPreference.clearAll();
    const allValues = await DefaultPreference.getAll();
    expect(allValues).toEqual({});
  });

  it('should not set the name if no name is provided', () => {
    expect(RNDefaultPreference.setName).not.toHaveBeenCalled();
  });

  it('should set the name if a name is provided', async () => {
    await DefaultPreference.setName('group.reactnative.example');
    expect(RNDefaultPreference.setName).toHaveBeenCalledWith('group.reactnative.example');
  });

  it('should not call setName if name is default', () => {
    expect(RNDefaultPreference.setName).not.toHaveBeenCalled();
  });

  it('should call setName if name is not default', async () => {
    await DefaultPreference.setName('customName');
    expect(RNDefaultPreference.setName).toHaveBeenCalledWith('customName');
  });

  it('should handle multiple group names correctly', async () => {
    await DefaultPreference.setName('group1');
    await DefaultPreference.set('key1', 'value1');
    const value1 = await DefaultPreference.get('key1');

    await DefaultPreference.setName('group2');
    await DefaultPreference.set('key1', 'value2');
    const value2 = await DefaultPreference.get('key1');

    expect(value1).toBe('value1');
    expect(value2).toBe('value2');
  });

  it('should get the current group name', async () => {
    // Arrange
    const currentGroupName = 'testGroup';
    mockDefaultPreference.getName.mockResolvedValue(currentGroupName);

    // Act
    await DefaultPreference.setName(currentGroupName);
    const groupName = await DefaultPreference.getName();

    // Assert
    expect(RNDefaultPreference.setName).toHaveBeenCalledWith(currentGroupName);
    expect(groupName).toBe(currentGroupName);
  });
});