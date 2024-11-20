let mockPreferences = {};

const getSuite = (name) => {
  if (!mockPreferences[name]) {
    mockPreferences[name] = {};
  }
  return mockPreferences[name];
};

const DefaultPreference = {
  setName: jest.fn((name) => {
    // Initialize suite if not present
    if (!mockPreferences[name]) {
      mockPreferences[name] = {};
    }
    return Promise.resolve();
  }),
  
  getName: jest.fn((name) => {
    return Promise.resolve(name || 'default'); // Return provided name or 'default'
  }),

  get: jest.fn((name, key) => {
    const suite = getSuite(name || 'default');
    return Promise.resolve(suite.hasOwnProperty(key) ? suite[key] : null);
  }),

  set: jest.fn((name, key, value) => {
    const suite = getSuite(name || 'default');
    suite[key] = value;
    return Promise.resolve();
  }),

  clear: jest.fn((name, key) => {
    const suite = getSuite(name || 'default');
    delete suite[key];
    return Promise.resolve();
  }),

  getMultiple: jest.fn((name, keys) => {
    const suite = getSuite(name || 'default');
    const values = keys.map(key => (suite.hasOwnProperty(key) ? suite[key] : null));
    return Promise.resolve(values);
  }),

  setMultiple: jest.fn((name, keyValuePairs) => {
    const suite = getSuite(name || 'default');
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      suite[key] = value;
    });
    return Promise.resolve();
  }),

  clearMultiple: jest.fn((name, keys) => {
    const suite = getSuite(name || 'default');
    keys.forEach(key => delete suite[key]);
    return Promise.resolve();
  }),

  getAll: jest.fn((name) => {
    const suite = getSuite(name || 'default');
    return Promise.resolve({ ...suite });
  }),

  clearAll: jest.fn((name) => {
    mockPreferences[name || 'default'] = {};
    return Promise.resolve();
  }),

  // Add reset method to clear all suites
  reset: jest.fn(() => {
    mockPreferences = {};
  }),
};

module.exports = DefaultPreference;
