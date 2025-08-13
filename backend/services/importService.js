const csv = require("csv-parser");
const fs = require("fs");
const { Product, Seller, Listing } = require("../models");
const { Op } = require("sequelize");

class ImportService {
  constructor() {
    this.requiredFields = ["product_name", "price", "currency", "seller_name"];

    this.optionalFields = [
      "product_description",
      "category",
      "subcategory",
      "brand",
      "model",
      "sku",
      "condition",
      "availability",
      "stock_quantity",
      "images",
      "url",
      "seller_website",
      "seller_description",
      "seller_rating",
      "seller_total_ratings",
    ];
  }

  /**
   * Parse CSV file and return structured data
   */
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      const errors = [];
      let rowNumber = 1; // Start from 1 for user-friendly error messages

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          rowNumber++;
          const validationResult = this.validateRow(row, rowNumber);

          if (validationResult.isValid) {
            results.push(validationResult.data);
          } else {
            errors.push({
              row: rowNumber,
              message: validationResult.error,
            });
          }
        })
        .on("end", () => {
          resolve({ results, errors });
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  /**
   * Validate a single CSV row
   */
  validateRow(row, rowNumber) {
    // Check required fields
    for (const field of this.requiredFields) {
      if (!row[field] || row[field].trim() === "") {
        return {
          isValid: false,
          error: `Missing required field: ${field}`,
        };
      }
    }

    // Validate price
    const price = parseFloat(row.price);
    if (isNaN(price) || price < 0) {
      return {
        isValid: false,
        error: `Invalid price: ${row.price}`,
      };
    }

    // Validate currency
    if (row.currency && row.currency.length !== 3) {
      return {
        isValid: false,
        error: `Invalid currency: ${row.currency}`,
      };
    }

    // Validate stock quantity if provided
    if (row.stock_quantity) {
      const stockQty = parseInt(row.stock_quantity);
      if (isNaN(stockQty) || stockQty < 0) {
        return {
          isValid: false,
          error: `Invalid stock quantity: ${row.stock_quantity}`,
        };
      }
    }

    // Validate seller rating if provided
    if (row.seller_rating) {
      const rating = parseFloat(row.seller_rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return {
          isValid: false,
          error: `Invalid seller rating: ${row.seller_rating} (must be 0-5)`,
        };
      }
    }

    // Validate seller total ratings if provided
    if (row.seller_total_ratings) {
      const totalRatings = parseInt(row.seller_total_ratings);
      if (isNaN(totalRatings) || totalRatings < 0) {
        return {
          isValid: false,
          error: `Invalid seller total ratings: ${row.seller_total_ratings}`,
        };
      }
    }

    // Process images field
    let images = [];
    if (row.images) {
      images = row.images
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img);
    }

    // Build structured data
    const data = {
      product: {
        name: row.product_name.trim(),
        description: row.product_description?.trim() || "",
        category: row.category?.trim() || "electronics",
        subcategory: row.subcategory?.trim() || "general",
        brand: row.brand?.trim() || "Unknown",
        model: row.model?.trim() || "",
        sku:
          row.sku?.trim() ||
          `SKU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        images: images,
        source: "csv_import",
        externalId: `csv_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      },
      seller: {
        name: row.seller_name.trim(),
        website: row.seller_website?.trim() || "",
        description: row.seller_description?.trim() || "",
        rating: row.seller_rating ? parseFloat(row.seller_rating) : 0,
        totalRatings: row.seller_total_ratings
          ? parseInt(row.seller_total_ratings)
          : 0,
        source: "csv_import",
        externalId: `csv_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      },
      listing: {
        title: row.product_name.trim(),
        price: price,
        currency: row.currency?.trim() || "USD",
        description: row.product_description?.trim() || "",
        condition: row.condition?.trim() || "unknown",
        availability: row.availability?.trim() || "unknown",
        stockQuantity: row.stock_quantity ? parseInt(row.stock_quantity) : null,
        images: images,
        url: row.url?.trim() || "",
        source: "csv_import",
        externalId: `csv_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      },
    };

    return {
      isValid: true,
      data: data,
    };
  }

  /**
   * Import parsed data into database
   */
  async importData(parsedData) {
    const results = {
      productsCreated: 0,
      sellersCreated: 0,
      listingsCreated: 0,
      errors: [],
    };

    for (const item of parsedData) {
      try {
        // Find or create seller
        let seller = await Seller.findOne({
          where: {
            name: item.seller.name,
            source: "csv_import",
          },
        });

        if (!seller) {
          seller = await Seller.create(item.seller);
          results.sellersCreated++;
        }

        // Find or create product
        let product = await Product.findOne({
          where: {
            name: item.product.name,
            brand: item.product.brand,
            source: "csv_import",
          },
        });

        if (!product) {
          product = await Product.create(item.product);
          results.productsCreated++;
        }

        // Check if listing already exists
        const existingListing = await Listing.findOne({
          where: {
            productId: product.id,
            sellerId: seller.id,
            source: "csv_import",
          },
        });

        if (!existingListing) {
          // Create listing
          await Listing.create({
            ...item.listing,
            productId: product.id,
            sellerId: seller.id,
          });
          results.listingsCreated++;
        }
      } catch (error) {
        console.error(`Error importing row:`, error);
        results.errors.push({
          row: "Unknown",
          message: `Database error: ${error.message}`,
        });
      }
    }

    return results;
  }

  /**
   * Main import method
   */
  async importCSV(filePath) {
    try {
      console.log("Starting CSV import...");

      // Parse CSV
      const { results, errors } = await this.parseCSV(filePath);

      if (results.length === 0) {
        throw new Error("No valid rows found in CSV file");
      }

      console.log(
        `Parsed ${results.length} valid rows, ${errors.length} errors`
      );

      // Import data
      const importResults = await this.importData(results);

      // Combine parsing errors with import errors
      importResults.errors = [...errors, ...importResults.errors];

      console.log("CSV import completed:", importResults);

      return importResults;
    } catch (error) {
      console.error("CSV import failed:", error);
      throw error;
    }
  }

  /**
   * Clean up temporary file
   */
  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Temporary file cleaned up");
      }
    } catch (error) {
      console.error("Error cleaning up file:", error);
    }
  }
}

module.exports = ImportService;
