import { useMemo } from 'react';
import DefaultPreference from './index';

const useDefaultPreference = (groupName: string = 'default') => {
  const preference = useMemo(() => new DefaultPreference(groupName), [groupName]);

  const getPreference = async (key: string) => {
    return await preference.get(key);
  };

  const setPreference = async (key: string, value: string | number | boolean) => {
    await preference.set(key, value);
  };

  const clearPreference = async (key: string) => {
    await preference.clear(key);
  };

  const getMultiplePreferences = async (keys: string[]) => {
    return await preference.getMultiple(keys);
  };

  const setMultiplePreferences = async (data: { [key: string]: string | number | boolean }) => {
    await preference.setMultiple(data);
  };

  const clearMultiplePreferences = async (keys: string[]) => {
    await preference.clearMultiple(keys);
  };

  const getAllPreferences = async () => {
    return await preference.getAll();
  };

  const clearAllPreferences = async () => {
    await preference.clearAll();
  };

  return {
    getPreference,
    setPreference,
    clearPreference,
    getMultiplePreferences,
    setMultiplePreferences,
    clearMultiplePreferences,
    getAllPreferences,
    clearAllPreferences,
  };
};

export default useDefaultPreference;