module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isSlug(value) {
            if (!/^[a-z0-9-]+$/.test(value)) {
              throw new Error("Slug must contain only lowercase letters, numbers, and hyphens");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "parent_id",
        references: {
          model: "categories",
          key: "id",
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      tableName: "categories",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["slug"],
        },
        {
          fields: ["parent_id"],
        },
        {
          fields: ["is_active"],
        },
      ],
    }
  );

  // Instance methods
  Category.prototype.getFullPath = function () {
    if (this.parent) {
      return `${this.parent.getFullPath()} > ${this.name}`;
    }
    return this.name;
  };

  Category.prototype.getAncestors = function () {
    const ancestors = [];
    let current = this.parent;
    while (current) {
      ancestors.unshift(current);
      current = current.parent;
    }
    return ancestors;
  };

  // Class methods
  Category.findBySlug = async function (slug) {
    return await this.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: "parent",
          attributes: ["id", "name", "slug"],
        },
      ],
    });
  };

  Category.getTree = async function () {
    const categories = await this.findAll({
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: "children",
          where: { isActive: true },
          required: false,
        },
      ],
      where: {
        parentId: null,
        isActive: true,
      },
      order: [["name", "ASC"]],
    });

    return categories;
  };

  Category.getPopular = async function (limit = 20) {
    const { sequelize } = require("../config/database");
    
    const query = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        COUNT(l.id) as listing_count,
        AVG(l.price_base) as avg_price
      FROM categories c
      LEFT JOIN listings l ON c.id = l.category_id AND l.availability_status = 'available'
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.slug, c.description
      HAVING COUNT(l.id) > 0
      ORDER BY listing_count DESC, c.name
      LIMIT $1
    `;

    const result = await sequelize.query(query, {
      bind: [limit],
      type: sequelize.QueryTypes.SELECT,
    });

    return result.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      listingCount: parseInt(row.listing_count),
      averagePrice: row.avg_price ? parseFloat(row.avg_price) : 0,
    }));
  };

  return Category;
};
