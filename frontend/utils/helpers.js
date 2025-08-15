// =============================================================================
// UTILITY FUNCTIONS FOR SAFE DATA HANDLING
// =============================================================================

/**
 * Safe number formatting function
 * @param {*} value - The value to format
 * @param {string} fallback - Fallback value if conversion fails
 * @returns {string} - Formatted number string or fallback
 */
export const safeToLocaleString = (value, fallback = '0') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number' && !isNaN(value)) {
    return value.toLocaleString();
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed.toLocaleString();
    }
  }
  return fallback;
};

/**
 * Safe product field getter - tries multiple field names
 * @param {object} product - The product object
 * @param {string[]} fields - Array of field names to try
 * @param {string} fallback - Fallback value if no field found
 * @returns {string} - Field value or fallback
 */
export const getProductField = (product, fields, fallback = '') => {
  if (!product) return fallback;
  for (const field of fields) {
    if (product[field]) return product[field];
  }
  return fallback;
};

/**
 * Validate and transform seller data
 * @param {object} seller - Raw seller data
 * @returns {object} - Validated seller data
 */
export const validateSellerData = (seller) => ({
  ...seller,
  reviewCount: typeof seller.reviewCount === 'number' ? seller.reviewCount : 0,
  totalSales: typeof seller.totalSales === 'number' ? seller.totalSales : 0,
  rating: typeof seller.rating === 'number' ? seller.rating : 0,
});

/**
 * Validate and transform product data
 * @param {object} product - Raw product data
 * @returns {object} - Validated product data
 */
export const validateProductData = (product) => ({
  ...product,
  title: product.title || product.name || product.productName || 'Untitled Product',
  image: product.image || product.imageUrl || product.thumbnail || product.originalImage || '/placeholder-product.jpg',
  views: typeof product.views === 'number' ? product.views : 0,
  price: typeof product.price === 'number' ? product.price : 0,
  rating: typeof product.rating === 'number' ? product.rating : 0,
});

/**
 * Safe image URL handler with fallback
 * @param {object} product - Product object
 * @param {string} fallback - Fallback image URL
 * @returns {string} - Image URL
 */
export const getProductImage = (product, fallback = '/placeholder-product.jpg') => {
  return getProductField(
    product, 
    ['image', 'imageUrl', 'thumbnail', 'originalImage'], 
    fallback
  );
};

/**
 * Safe product title getter
 * @param {object} product - Product object
 * @returns {string} - Product title
 */
export const getProductTitle = (product) => {
  return getProductField(
    product, 
    ['title', 'name', 'productName'], 
    'Untitled Product'
  );
};

/**
 * Format price with currency symbol
 * @param {*} price - Price value
 * @param {string} currency - Currency symbol
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currency = '$') => {
  const numPrice = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(numPrice)) return `${currency}0.00`;
  return `${currency}${numPrice.toFixed(2)}`;
};

/**
 * Safe rating display
 * @param {*} rating - Rating value
 * @param {number} maxRating - Maximum rating value
 * @returns {number} - Safe rating value
 */
export const safeRating = (rating, maxRating = 5) => {
  const numRating = typeof rating === 'number' ? rating : parseFloat(rating);
  if (isNaN(numRating)) return 0;
  return Math.min(Math.max(numRating, 0), maxRating);
};

export default {
  safeToLocaleString,
  getProductField,
  validateSellerData,
  validateProductData,
  getProductImage,
  getProductTitle,
  formatPrice,
  safeRating
};
