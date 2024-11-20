import { renderHook, act } from '@testing-library/react-hooks';
import useDefaultPreference from './useDefaultPreference';
import DefaultPreference from './index';

jest.mock('./index');

describe('useDefaultPreference', () => {
  const mockGet = jest.fn();
  const mockSet = jest.fn();
  const mockClear = jest.fn();
  const mockGetMultiple = jest.fn();
  const mockSetMultiple = jest.fn();
  const mockClearMultiple = jest.fn();
  const mockGetAll = jest.fn();
  const mockClearAll = jest.fn();

  beforeEach(() => {
    (DefaultPreference as jest.Mock).mockImplementation(() => ({
      get: mockGet,
      set: mockSet,
      clear: mockClear,
      getMultiple: mockGetMultiple,
      setMultiple: mockSetMultiple,
      clearMultiple: mockClearMultiple,
      getAll: mockGetAll,
      clearAll: mockClearAll,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct group name', () => {
    renderHook(() => useDefaultPreference('testGroup'));
    expect(DefaultPreference).toHaveBeenCalledWith('testGroup');
  });

  it('should use default group name when none is provided', () => {
    renderHook(() => useDefaultPreference());
    expect(DefaultPreference).toHaveBeenCalledWith('default');
  });

  it('should get a preference value', async () => {
    mockGet.mockResolvedValue('testValue');
    const { result } = renderHook(() => useDefaultPreference());

    const value = await result.current.getPreference('testKey');
    expect(mockGet).toHaveBeenCalledWith('testKey');
    expect(value).toBe('testValue');
  });

  it('should set a preference value', async () => {
    const { result } = renderHook(() => useDefaultPreference());

    await act(async () => {
      await result.current.setPreference('testKey', 'testValue');
    });
    expect(mockSet).toHaveBeenCalledWith('testKey', 'testValue');
  });

  it('should clear a preference value', async () => {
    const { result } = renderHook(() => useDefaultPreference());

    await act(async () => {
      await result.current.clearPreference('testKey');
    });
    expect(mockClear).toHaveBeenCalledWith('testKey');
  });

  it('should get multiple preferences', async () => {
    const mockValues = ['value1', 'value2', null];
    mockGetMultiple.mockResolvedValue(mockValues);
    const { result } = renderHook(() => useDefaultPreference());

    const values = await result.current.getMultiplePreferences(['key1', 'key2', 'key3']);
    expect(mockGetMultiple).toHaveBeenCalledWith(['key1', 'key2', 'key3']);
    expect(values).toEqual(mockValues);
  });

  it('should set multiple preferences', async () => {
    const data = { key1: 'value1', key2: 2, key3: true };
    const { result } = renderHook(() => useDefaultPreference());

    await act(async () => {
      await result.current.setMultiplePreferences(data);
    });
    expect(mockSetMultiple).toHaveBeenCalledWith(data);
  });

  it('should clear multiple preferences', async () => {
    const keys = ['key1', 'key2', 'key3'];
    const { result } = renderHook(() => useDefaultPreference());

    await act(async () => {
      await result.current.clearMultiplePreferences(keys);
    });
    expect(mockClearMultiple).toHaveBeenCalledWith(keys);
  });

  it('should get all preferences', async () => {
    const mockAll = { key1: 'value1', key2: 2, key3: true };
    mockGetAll.mockResolvedValue(mockAll);
    const { result } = renderHook(() => useDefaultPreference());

    const all = await result.current.getAllPreferences();
    expect(mockGetAll).toHaveBeenCalled();
    expect(all).toEqual(mockAll);
  });

  it('should clear all preferences', async () => {
    const { result } = renderHook(() => useDefaultPreference());

    await act(async () => {
      await result.current.clearAllPreferences();
    });
    expect(mockClearAll).toHaveBeenCalled();
  });
});