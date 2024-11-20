let mockPreferences = {};
let currentSuiteName = 'default'; // Variable to track the current suite name

const getSuite = (name) => {
  if (!mockPreferences[name]) {
    mockPreferences[name] = {};
  }
  return mockPreferences[name];
};

const DefaultPreference = {
  setName: jest.fn((name) => {
    currentSuiteName = name; // Update the current suite name
    // Initialize suite if not present
    if (!mockPreferences[name]) {
      mockPreferences[name] = {};
    }
    return Promise.resolve();
  }),

  getName: jest.fn(() => {
    return Promise.resolve(currentSuiteName);
  }),

  get: jest.fn((key) => {
    const suite = getSuite(currentSuiteName); // Use the current suite name
    return Promise.resolve(suite.hasOwnProperty(key) ? suite[key] : null);
  }),

  set: jest.fn((key, value) => {
    const suite = getSuite(currentSuiteName);
    suite[key] = value;
    return Promise.resolve();
  }),

  clear: jest.fn((key) => {
    const suite = getSuite(currentSuiteName);
    delete suite[key];
    return Promise.resolve();
  }),

  getMultiple: jest.fn((keys) => {
    const suite = getSuite(currentSuiteName);
    const values = keys.map((key) => (suite.hasOwnProperty(key) ? suite[key] : null));
    return Promise.resolve(values);
  }),

  setMultiple: jest.fn((keyValuePairs) => {
    const suite = getSuite(currentSuiteName);
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      suite[key] = value;
    });
    return Promise.resolve();
  }),

  clearMultiple: jest.fn((keys) => {
    const suite = getSuite(currentSuiteName);
    keys.forEach((key) => delete suite[key]);
    return Promise.resolve();
  }),

  getAll: jest.fn(() => {
    const suite = getSuite(currentSuiteName);
    return Promise.resolve({ ...suite });
  }),

  clearAll: jest.fn(() => {
    mockPreferences[currentSuiteName] = {};
    return Promise.resolve();
  }),

  reset: jest.fn(() => {
    mockPreferences = {};
    currentSuiteName = 'default'; // Reset the current suite name
    return Promise.resolve();
  }),
};

module.exports = {
  default: DefaultPreference,
};