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
  
  getName: jest.fn(() => {
    return Promise.resolve('default');
  }),

  get: jest.fn((key) => {
    const suite = getSuite('default');
    return Promise.resolve(suite.hasOwnProperty(key) ? suite[key] : null);
  }),

  set: jest.fn((key, value) => {
    const suite = getSuite('default');
    suite[key] = value;
    return Promise.resolve();
  }),

  clear: jest.fn((key) => {
    const suite = getSuite('default');
    delete suite[key];
    return Promise.resolve();
  }),

  getMultiple: jest.fn((keys) => {
    const suite = getSuite('default');
    const values = keys.map(key => (suite.hasOwnProperty(key) ? suite[key] : null));
    return Promise.resolve(values);
  }),

  setMultiple: jest.fn((keyValuePairs) => {
    const suite = getSuite('default');
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      suite[key] = value;
    });
    return Promise.resolve();
  }),

  clearMultiple: jest.fn((keys) => {
    const suite = getSuite('default');
    keys.forEach(key => delete suite[key]);
    return Promise.resolve();
  }),

  getAll: jest.fn(() => {
    const suite = getSuite('default');
    return Promise.resolve({ ...suite });
  }),

  clearAll: jest.fn(() => {
    mockPreferences['default'] = {};
    return Promise.resolve();
  }),

  reset: jest.fn(() => {
    mockPreferences = {};
  }),
};

module.exports = DefaultPreference;
