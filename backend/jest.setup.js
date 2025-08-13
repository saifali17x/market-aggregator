// backend/jest.setup.js
// Comprehensive Jest setup to mock all database and external dependencies

// Mock sequelize before any imports
jest.mock("sequelize", () => ({
  DataTypes: {
    UUID: "UUID",
    UUIDV4: "UUIDV4",
    STRING: "STRING",
    TEXT: "TEXT",
    DECIMAL: "DECIMAL",
    INTEGER: "INTEGER",
    BOOLEAN: "BOOLEAN",
    DATE: "DATE",
    JSONB: "JSONB",
    ENUM: "ENUM",
  },
  Op: {
    and: Symbol("and"),
    or: Symbol("or"),
    not: Symbol("not"),
    eq: Symbol("eq"),
    ne: Symbol("ne"),
    gt: Symbol("gt"),
    gte: Symbol("gte"),
    lt: Symbol("lt"),
    lte: Symbol("lte"),
    like: Symbol("like"),
    iLike: Symbol("iLike"),
    notLike: Symbol("notLike"),
    notILike: Symbol("notILike"),
    in: Symbol("in"),
    notIn: Symbol("notIn"),
    between: Symbol("between"),
    notBetween: Symbol("notBetween"),
    overlap: Symbol("overlap"),
    contains: Symbol("contains"),
    contained: Symbol("contained"),
    adjacent: Symbol("adjacent"),
    strictLeft: Symbol("strictLeft"),
    strictRight: Symbol("strictRight"),
    noExtendLeft: Symbol("noExtendLeft"),
    noExtendRight: Symbol("noExtendRight"),
    any: Symbol("any"),
    all: Symbol("all"),
    values: Symbol("values"),
    col: Symbol("col"),
    placeholder: Symbol("placeholder"),
    join: Symbol("join"),
  },
}));

// Mock mongoose
jest.mock("mongoose", () => {
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

  return {
    Schema: Schema,
    model: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
    },
  };
});

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue("salt"),
}));

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue("salt"),
}));

// Mock models directory
jest.mock("../models", () => require("./__mocks__/models.js"));

// Mock database config
jest.mock("../config/database", () => require("./__mocks__/database.js"));

// Mock any remaining database imports
jest.mock("pg", () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(),
    query: jest.fn().mockResolvedValue({ rows: [] }),
    end: jest.fn().mockResolvedValue(),
  })),
}));

// Mock sequelize connection
jest.mock("sequelize", () => {
  const originalModule = jest.requireActual("sequelize");
  return {
    ...originalModule,
    Sequelize: jest.fn().mockImplementation(() => ({
      authenticate: jest.fn().mockResolvedValue(),
      define: jest.fn(),
      sync: jest.fn().mockResolvedValue(),
      close: jest.fn().mockResolvedValue(),
    })),
  };
});

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = "test";

  // Mock console methods to reduce noise in tests
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Global test cleanup
afterAll(() => {
  // Restore console methods
  jest.restoreAllMocks();
});

// Mock process.exit to prevent tests from exiting
process.exit = jest.fn();
