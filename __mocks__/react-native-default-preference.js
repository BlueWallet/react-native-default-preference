let mockPreferences = {};

// Helper function to get or create a preferences suite
const getSuite = (name) => {
  if (!mockPreferences[name]) {
    mockPreferences[name] = {};
  }
  return mockPreferences[name];
};

const DefaultPreference = {
  setName: jest.fn((name) => {
    // Mock implementation for setName
    return Promise.resolve();
  }),
  
  getName: jest.fn((name) => {
    // Return the current suite name or null
    return Promise.resolve(name || null);
  }),

  get: jest.fn((name, key) => {
    const suite = getSuite(name);
    return Promise.resolve(suite.hasOwnProperty(key) ? suite[key] : null);
  }),

  set: jest.fn((name, key, value) => {
    const suite = getSuite(name);
    suite[key] = value;
    return Promise.resolve();
  }),

  clear: jest.fn((name, key) => {
    const suite = getSuite(name);
    delete suite[key];
    return Promise.resolve();
  }),

  getMultiple: jest.fn((name, keys) => {
    const suite = getSuite(name);
    const values = keys.map(key => (suite.hasOwnProperty(key) ? suite[key] : null));
    return Promise.resolve(values);
  }),

  setMultiple: jest.fn((name, keyValuePairs) => {
    const suite = getSuite(name);
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      suite[key] = value;
    });
    return Promise.resolve();
  }),

  clearMultiple: jest.fn((name, keys) => {
    const suite = getSuite(name);
    keys.forEach(key => delete suite[key]);
    return Promise.resolve();
  }),

  getAll: jest.fn((name) => {
    const suite = getSuite(name);
    return Promise.resolve({ ...suite });
  }),

  clearAll: jest.fn((name) => {
    mockPreferences[name] = {};
    return Promise.resolve();
  }),

  setDataStore: jest.fn((name, key, value) => {
    const suite = getSuite(name);
    suite[key] = value;
    return Promise.resolve();
  }),

  clearDataStore: jest.fn((name, key) => {
    const suite = getSuite(name);
    delete suite[key];
    return Promise.resolve();
  }),

  getMultipleDataStore: jest.fn((name, keys) => {
    const suite = getSuite(name);
    const values = keys.map(key => (suite.hasOwnProperty(key) ? suite[key] : null));
    return Promise.resolve(values);
  }),

  setMultipleDataStore: jest.fn((name, keyValuePairs) => {
    const suite = getSuite(name);
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      suite[key] = value;
    });
    return Promise.resolve();
  }),

  clearMultipleDataStore: jest.fn((name, keys) => {
    const suite = getSuite(name);
    keys.forEach(key => delete suite[key]);
    return Promise.resolve();
  }),

  getAllDataStore: jest.fn((name) => {
    const suite = getSuite(name);
    return Promise.resolve({ ...suite });
  }),

  clearAllDataStore: jest.fn((name) => {
    mockPreferences[name] = {};
    return Promise.resolve();
  }),
};

module.exports = DefaultPreference;
