module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define(
    "Price",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 3],
          isUppercase: true,
        },
      },
      rateToUsd: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        field: "rate_to_usd",
        validate: {
          min: 0,
        },
      },
      fetchedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "fetched_at",
        defaultValue: DataTypes.NOW,
      },
      source: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "manual",
      },
    },
    {
      tableName: "prices",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["currency"],
        },
        {
          fields: ["fetched_at"],
        },
        {
          fields: ["source"],
        },
      ],
    }
  );

  // Instance methods
  Price.prototype.convertToUsd = function (amount) {
    return parseFloat(amount) * parseFloat(this.rateToUsd);
  };

  Price.prototype.convertFromUsd = function (usdAmount) {
    return parseFloat(usdAmount) / parseFloat(this.rateToUsd);
  };

  // Class methods
  Price.getRate = async function (currency) {
    const price = await this.findOne({
      where: { currency: currency.toUpperCase() },
      order: [["fetchedAt", "DESC"]],
    });
    return price ? price.rateToUsd : null;
  };

  Price.convertCurrency = async function (amount, fromCurrency, toCurrency = "USD") {
    if (fromCurrency === toCurrency) {
      return parseFloat(amount);
    }

    if (toCurrency === "USD") {
      const rate = await this.getRate(fromCurrency);
      return rate ? parseFloat(amount) * parseFloat(rate) : null;
    }

    // Convert to USD first, then to target currency
    const usdAmount = await this.convertCurrency(amount, fromCurrency, "USD");
    if (usdAmount === null) return null;

    const targetRate = await this.getRate(toCurrency);
    return targetRate ? usdAmount / parseFloat(targetRate) : null;
  };

  Price.updateRates = async function (rates) {
    const updates = [];
    const now = new Date();

    for (const [currency, rate] of Object.entries(rates)) {
      if (currency === "USD") continue; // Skip USD as it's always 1.0

      updates.push({
        currency: currency.toUpperCase(),
        rateToUsd: parseFloat(rate),
        fetchedAt: now,
        source: "api",
      });
    }

    if (updates.length > 0) {
      await this.bulkCreate(updates, {
        updateOnDuplicate: ["rateToUsd", "fetchedAt", "source", "updatedAt"],
      });
    }

    return updates.length;
  };

  Price.getStaleRates = async function (maxAgeHours = 24) {
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    return await this.findAll({
      where: {
        fetchedAt: {
          [require("sequelize").Op.lt]: cutoff,
        },
      },
      attributes: ["currency", "fetchedAt"],
    });
  };

  return Price;
};
