// backend/__mocks__/mongoose.js
// Create a constructor function for Schema
function Schema() {
  return {
    index: jest.fn(),
    pre: jest.fn(),
    post: jest.fn(),
    virtual: jest.fn(),
    method: jest.fn(),
    static: jest.fn(),
    plugin: jest.fn(),
    add: jest.fn(),
    path: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
  };
}

// Add Types as a static property
Schema.Types = {
  Mixed: "Mixed",
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
  Date: "Date",
  ObjectId: "ObjectId",
  Array: "Array",
  Buffer: "Buffer",
};

module.exports = {
  Schema: Schema,
  model: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
  },
};
