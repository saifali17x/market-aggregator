// backend/__mocks__/database.js
module.exports = {
  sequelize: {
    define: jest.fn(),
    sync: jest.fn(),
    authenticate: jest.fn().mockResolvedValue(true),
    close: jest.fn(),
    query: jest.fn().mockResolvedValue([]),
  },
  Sequelize: {
    DataTypes: {
      STRING: "STRING",
      TEXT: "TEXT",
      INTEGER: "INTEGER",
      FLOAT: "FLOAT",
      BOOLEAN: "BOOLEAN",
      DATE: "DATE",
      UUID: "UUID",
      UUIDV4: "UUIDV4",
    },
    Op: {
      and: "and",
      or: "or",
      like: "like",
      ilike: "ilike",
      in: "in",
      notIn: "notIn",
      gt: "gt",
      gte: "gte",
      lt: "lt",
      lte: "lte",
      between: "between",
      notBetween: "notBetween",
    },
  },
};
