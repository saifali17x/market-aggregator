// backend/__mocks__/models.js
// Complete mock for all models to prevent database connections

const mockProduct = {
  id: 1,
  title: "Mock Product",
  brand: "mock",
  model: "mock model",
  description: "Mock description",
  price: 99.99,
  currency: "USD",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProductMatch = {
  id: 1,
  productId: 1,
  matchedProductId: 2,
  confidenceScore: 0.85,
  matchType: "direct",
  matchedFields: ["title", "brand"],
  createdAt: new Date(),
};

const mockListing = {
  id: 1,
  productId: 1,
  sellerId: 1,
  price: 99.99,
  currency: "USD",
  availabilityStatus: "available",
  createdAt: new Date(),
};

const mockSeller = {
  id: 1,
  name: "Mock Seller",
  verified: true,
  platform: "mock",
  rating: 4.5,
  createdAt: new Date(),
};

const mockCategory = {
  id: 1,
  name: "Electronics",
  description: "Electronic devices",
  createdAt: new Date(),
};

const mockClickLog = {
  id: 1,
  productId: 1,
  listingId: 1,
  userId: 1,
  clickedAt: new Date(),
};

const mockScrapingJob = {
  id: 1,
  siteName: "mock",
  status: "completed",
  startedAt: new Date(),
  completedAt: new Date(),
};

const mockPrice = {
  id: 1,
  currency: "USD",
  rateToUsd: 1.0,
  isActive: true,
  fetchedAt: new Date(),
};

// Mock all the methods that the services might call
const createMockModel = (mockData) => ({
  create: jest.fn().mockResolvedValue(mockData),
  findAll: jest.fn().mockResolvedValue([mockData]),
  findOne: jest.fn().mockResolvedValue(mockData),
  findByPk: jest.fn().mockResolvedValue(mockData),
  update: jest.fn().mockResolvedValue([1]),
  destroy: jest.fn().mockResolvedValue(1),
  searchByKeywords: jest.fn().mockResolvedValue([mockData]),
  findSimilar: jest.fn().mockResolvedValue([mockData]),
  findSimilar: jest.fn().mockResolvedValue([mockData]),
  // Add any other methods that might be called
  bulkCreate: jest.fn().mockResolvedValue([mockData]),
  count: jest.fn().mockResolvedValue(1),
  max: jest.fn().mockResolvedValue(100),
  min: jest.fn().mockResolvedValue(10),
  sum: jest.fn().mockResolvedValue(1000),
});

module.exports = {
  Product: createMockModel(mockProduct),
  ProductMatch: createMockModel(mockProductMatch),
  Listing: createMockModel(mockListing),
  Seller: createMockModel(mockSeller),
  User: createMockModel({ id: 1, email: "test@test.com" }),
  Category: createMockModel(mockCategory),
  ClickLog: createMockModel(mockClickLog),
  ScrapingJob: createMockModel(mockScrapingJob),
  Price: createMockModel(mockPrice),

  // Add any other models that might be imported
  sequelize: {
    transaction: jest.fn().mockImplementation(() => ({
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
    })),
  },

  // Mock the Op object that Sequelize uses
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
    and: Symbol("and"),
    or: Symbol("or"),
    any: Symbol("any"),
    all: Symbol("all"),
    values: Symbol("values"),
    col: Symbol("col"),
    placeholder: Symbol("placeholder"),
    join: Symbol("join"),
  },
};
