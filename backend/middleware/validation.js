// Validation middleware for API requests

const validateSearchParams = (req, res, next) => {
    const { 
      q, 
      category, 
      minPrice, 
      maxPrice, 
      location, 
      condition,
      sortBy, 
      sortOrder, 
      page, 
      limit 
    } = req.query;
  
    const errors = [];
  
    // Validate search query length
    if (q && q.length > 200) {
      errors.push('Search query must be less than 200 characters');
    }
  
    // Validate category
    if (category && category.length > 100) {
      errors.push('Category must be less than 100 characters');
    }
  
    // Validate price parameters
    if (minPrice !== undefined) {
      const min = parseFloat(minPrice);
      if (isNaN(min) || min < 0) {
        errors.push('minPrice must be a valid positive number');
      }
    }
  
    if (maxPrice !== undefined) {
      const max = parseFloat(maxPrice);
      if (isNaN(max) || max < 0) {
        errors.push('maxPrice must be a valid positive number');
      }
      
      if (minPrice !== undefined) {
        const min = parseFloat(minPrice);
        if (!isNaN(min) && !isNaN(max) && max < min) {
          errors.push('maxPrice must be greater than minPrice');
        }
      }
    }
  
    // Validate location
    if (location && location.length > 200) {
      errors.push('Location must be less than 200 characters');
    }
  
    // Validate condition
    const validConditions = ['new', 'used', 'refurbished', 'for-parts'];
    if (condition && !validConditions.includes(condition.toLowerCase())) {
      errors.push(`Condition must be one of: ${validConditions.join(', ')}`);
    }
  
    // Validate sorting parameters
    const validSortFields = ['price', 'created_at', 'updated_at', 'views_count', 'favorites_count', 'seller_rating', 'relevance'];
    if (sortBy && !validSortFields.includes(sortBy.toLowerCase())) {
      errors.push(`sortBy must be one of: ${validSortFields.join(', ')}`);
    }
  
    const validSortOrders = ['asc', 'desc'];
    if (sortOrder && !validSortOrders.includes(sortOrder.toLowerCase())) {
      errors.push(`sortOrder must be one of: ${validSortOrders.join(', ')}`);
    }
  
    // Validate pagination parameters
    if (page !== undefined) {
      const pageNum = parseInt(page, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        errors.push('page must be a positive integer');
      }
      if (pageNum > 10000) {
        errors.push('page must be less than 10000');
      }
    }
  
    if (limit !== undefined) {
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1) {
        errors.push('limit must be a positive integer');
      }
      if (limitNum > 100) {
        errors.push('limit must be 100 or less');
      }
    }
  
    // Return validation errors if any
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }
  
    // Add request start time for performance tracking
    req.startTime = Date.now();
  
    next();
  };
  
  const validateListingId = (req, res, next) => {
    const { id } = req.params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Listing ID is required',
        code: 'MISSING_ID'
      });
    }
  
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid listing ID format. Must be a valid UUID.',
        code: 'INVALID_ID_FORMAT'
      });
    }
  
    next();
  };
  
  const sanitizeInput = (req, res, next) => {
    // Basic input sanitization
    const sanitize = (str) => {
      if (typeof str !== 'string') return str;
      
      // Remove potentially dangerous characters
      return str
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    };
  
    // Sanitize query parameters
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitize(req.query[key]);
      }
    });
  
    // Sanitize body parameters
    if (req.body && typeof req.body === 'object') {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitize(req.body[key]);
        }
      });
    }
  
    next();
  };
  
  const validateRequiredFields = (requiredFields) => {
    return (req, res, next) => {
      const missingFields = [];
      
      requiredFields.forEach(field => {
        const value = req.body[field] || req.query[field] || req.params[field];
        if (value === undefined || value === null || value === '') {
          missingFields.push(field);
        }
      });
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Required fields are missing',
          missingFields,
          code: 'MISSING_REQUIRED_FIELDS'
        });
      }
  
      next();
    };
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Generic validation helper
  const validate = (schema) => {
    return (req, res, next) => {
      const errors = [];
      
      Object.keys(schema).forEach(field => {
        const rules = schema[field];
        const value = req.body[field] || req.query[field] || req.params[field];
        
        // Required validation
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          return;
        }
        
        // Skip other validations if field is not required and empty
        if (!rules.required && !value) return;
        
        // Type validation
        if (rules.type) {
          switch (rules.type) {
            case 'string':
              if (typeof value !== 'string') {
                errors.push(`${field} must be a string`);
              }
              break;
            case 'number':
              if (isNaN(parseFloat(value))) {
                errors.push(`${field} must be a number`);
              }
              break;
            case 'integer':
              if (!Number.isInteger(parseFloat(value))) {
                errors.push(`${field} must be an integer`);
              }
              break;
            case 'boolean':
              if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
                errors.push(`${field} must be a boolean`);
              }
              break;
            case 'email':
              if (!validateEmail(value)) {
                errors.push(`${field} must be a valid email`);
              }
              break;
            case 'phone':
              if (!validatePhone(value)) {
                errors.push(`${field} must be a valid phone number`);
              }
              break;
            case 'url':
              if (!validateUrl(value)) {
                errors.push(`${field} must be a valid URL`);
              }
              break;
          }
        }
        
        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters long`);
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be no more than ${rules.maxLength} characters long`);
        }
        
        // Range validation for numbers
        if (rules.min !== undefined) {
          const numValue = parseFloat(value);
          if (numValue < rules.min) {
            errors.push(`${field} must be at least ${rules.min}`);
          }
        }
        
        if (rules.max !== undefined) {
          const numValue = parseFloat(value);
          if (numValue > rules.max) {
            errors.push(`${field} must be no more than ${rules.max}`);
          }
        }
        
        // Enum validation
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      });
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
          code: 'VALIDATION_ERROR'
        });
      }
      
      next();
    };
  };
  
  module.exports = {
    validateSearchParams,
    validateListingId,
    sanitizeInput,
    validateRequiredFields,
    validateEmail,
    validatePhone,
    validateUrl,
    validate
  };
