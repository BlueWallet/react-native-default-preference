import { useEffect } from 'react';
import DefaultPreference from './index';

const useDefaultPreference = (groupName: string = 'default') => {
  useEffect(() => {
    DefaultPreference.setName(groupName);
  }, [groupName]);

  const getPreference = async (key: string) => {
    return await DefaultPreference.get(key);
  };

  const setPreference = async (key: string, value: string | number | boolean) => {
    await DefaultPreference.set(key, value);
  };

  const clearPreference = async (key: string) => {
    await DefaultPreference.clear(key);
  };

  const getMultiplePreferences = async (keys: string[]) => {
    return await DefaultPreference.getMultiple(keys);
  };

  const setMultiplePreferences = async (data: { [key: string]: string | number | boolean }) => {
    await DefaultPreference.setMultiple(data);
  };

  const clearMultiplePreferences = async (keys: string[]) => {
    await DefaultPreference.clearMultiple(keys);
  };

  const getAllPreferences = async () => {
    return await DefaultPreference.getAll();
  };

  const clearAllPreferences = async () => {
    await DefaultPreference.clearAll();
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