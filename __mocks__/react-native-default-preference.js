let mockPreferences = {};

const getSuite = (name) => {
  if (!mockPreferences[name]) {
    mockPreferences[name] = {};
  }
  return mockPreferences[name];
};

const DefaultPreference = {
  setName: jest.fn((name) => {
    return Promise.resolve();
  }),
  
  getName: jest.fn(() => {
    return Promise.resolve('default'); // Default suite
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
};

module.exports = DefaultPreference;
