import sharp from 'sharp';
import Product from '../models/productsModel.js';
import catchAsyncErrors from '../middlewares/error.js';
import ErrorHandler from '../utils/errorHandler.js';

// Enhanced image search controller
export const searchByImage = catchAsyncErrors(async (req, res, next) => {
  console.log('=== IMAGE SEARCH DEBUG ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  console.log('File buffer exists:', !!req.file?.buffer);
  console.log('File size:', req.file?.size);
  console.log('File mimetype:', req.file?.mimetype);
  console.log('========================');

  if (!req.file) {
    console.log('No file uploaded');
    return next(new ErrorHandler('Please upload an image', 400));
  }

  if (!req.file.buffer) {
    console.log('No file buffer found');
    return next(new ErrorHandler('File buffer not found', 400));
  }

  try {
    console.log('Starting advanced image similarity search...');
    
    // Extract features from uploaded image
    const uploadedFeatures = await extractAdvancedFeatures(req.file.buffer);
    console.log('Uploaded image features extracted');
    
    // Get all products with images
    const products = await Product.find({ 
      picture: { $exists: true, $ne: null } 
    }).populate('category');
    
    console.log(`Found ${products.length} products with images`);
    
    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
        message: 'No products with images found'
      });
    }
    
    // Calculate similarity for each product
    const productSimilarities = [];
    
    for (const product of products) {
      try {
        if (product.picture && product.picture.secure_url) {
          // Download and analyze product image
          const response = await fetch(product.picture.secure_url);
          if (response.ok) {
            const productImageBuffer = await response.arrayBuffer();
            const productFeatures = await extractAdvancedFeatures(Buffer.from(productImageBuffer));
            
            // Calculate similarity
            const similarity = calculateAdvancedSimilarity(uploadedFeatures, productFeatures, product);
            
            console.log(`Product ${product.title}: similarity = ${similarity.toFixed(3)}`);
            
            if (similarity > 0.6) { // Much higher threshold for better accuracy
              productSimilarities.push({
                product,
                similarity
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error processing product ${product._id}:`, error);
        // Continue with other products
      }
    }
    
    console.log(`Found ${productSimilarities.length} products above 60% similarity threshold`);
    
    // If no products meet the high threshold, lower it slightly
    if (productSimilarities.length === 0) {
      console.log('No products met 60% threshold, lowering to 50%...');
      for (const product of products) {
        try {
          if (product.picture && product.picture.secure_url) {
            const response = await fetch(product.picture.secure_url);
            if (response.ok) {
              const productImageBuffer = await response.arrayBuffer();
              const productFeatures = await extractAdvancedFeatures(Buffer.from(productImageBuffer));
              const similarity = calculateAdvancedSimilarity(uploadedFeatures, productFeatures, product);
              
              if (similarity > 0.5) {
                productSimilarities.push({
                  product,
                  similarity
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error processing product ${product._id}:`, error);
        }
      }
    }
    
    // Sort by similarity and return top results
    const sortedProducts = productSimilarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4) // Return even fewer results for better accuracy
      .map(item => ({
        ...item.product.toObject(),
        similarity: Math.round(item.similarity * 100)
      }));
    
    console.log(`Returning ${sortedProducts.length} similar products`);
    
    res.status(200).json({
      success: true,
      products: sortedProducts,
      totalResults: sortedProducts.length,
      message: `Found ${sortedProducts.length} similar products`
    });
    
  } catch (error) {
    console.error('Image search error:', error);
    return next(new ErrorHandler('Error processing image search', 500));
  }
});

// Advanced feature extraction using Sharp
const extractAdvancedFeatures = async (imageBuffer) => {
  try {
    // Resize image for consistent processing
    const resizedImage = await sharp(imageBuffer)
      .resize(100, 100, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Get image metadata
    const metadata = await sharp(resizedImage).metadata();
    
    // Convert to RGB array for analysis
    const pixels = new Uint8Array(resizedImage);
    const rgbPixels = [];
    
    for (let i = 0; i < pixels.length; i += 3) {
      rgbPixels.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
    }
    
    // Calculate color histogram
    const histogram = calculateColorHistogram(rgbPixels);
    
    // Calculate brightness and contrast
    const brightness = calculateBrightness(rgbPixels);
    const contrast = calculateContrast(rgbPixels);
    
    // Calculate color variance
    const colorVariance = calculateColorVariance(rgbPixels);
    
    return {
      histogram,
      brightness,
      contrast,
      colorVariance,
      dominantColors: extractDominantColors(rgbPixels),
      aspectRatio: metadata.width / metadata.height,
      size: imageBuffer.length
    };
  } catch (error) {
    console.error('Error extracting advanced features:', error);
    // Return default features if processing fails
    return {
      histogram: new Array(256).fill(0),
      brightness: 128,
      contrast: 50,
      colorVariance: 0,
      dominantColors: [{ r: 128, g: 128, b: 128 }],
      aspectRatio: 1,
      size: imageBuffer.length
    };
  }
};

// Calculate color histogram
const calculateColorHistogram = (rgbPixels) => {
  const histogram = new Array(256).fill(0);
  
  rgbPixels.forEach(([r, g, b]) => {
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    histogram[gray]++;
  });
  
  // Normalize histogram
  const total = histogram.reduce((sum, val) => sum + val, 0);
  return histogram.map(val => val / total);
};

// Calculate brightness
const calculateBrightness = (rgbPixels) => {
  const total = rgbPixels.reduce((sum, [r, g, b]) => {
    return sum + (r + g + b) / 3;
  }, 0);
  return total / rgbPixels.length;
};

// Calculate contrast
const calculateContrast = (rgbPixels) => {
  const brightness = calculateBrightness(rgbPixels);
  const variance = rgbPixels.reduce((sum, [r, g, b]) => {
    const pixelBrightness = (r + g + b) / 3;
    return sum + Math.pow(pixelBrightness - brightness, 2);
  }, 0) / rgbPixels.length;
  return Math.sqrt(variance);
};

// Calculate color variance
const calculateColorVariance = (rgbPixels) => {
  const avgR = rgbPixels.reduce((sum, [r]) => sum + r, 0) / rgbPixels.length;
  const avgG = rgbPixels.reduce((sum, [, g]) => sum + g, 0) / rgbPixels.length;
  const avgB = rgbPixels.reduce((sum, [, , b]) => sum + b, 0) / rgbPixels.length;
  
  const variance = rgbPixels.reduce((sum, [r, g, b]) => {
    return sum + Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2);
  }, 0) / rgbPixels.length;
  
  return Math.sqrt(variance);
};

// Extract dominant colors using k-means clustering
const extractDominantColors = (rgbPixels) => {
  const k = 5;
  const centroids = [];
  
  // Initialize centroids randomly
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * rgbPixels.length);
    centroids.push([...rgbPixels[randomIndex]]);
  }
  
  // K-means iterations
  for (let iter = 0; iter < 5; iter++) {
    const clusters = Array.from({ length: k }, () => []);
    
    // Assign pixels to nearest centroid
    rgbPixels.forEach(pixel => {
      let minDistance = Infinity;
      let clusterIndex = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(pixel, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = index;
        }
      });
      
      clusters[clusterIndex].push(pixel);
    });
    
    // Update centroids
    clusters.forEach((cluster, index) => {
      if (cluster.length > 0) {
        const avgColor = cluster.reduce((sum, pixel) => 
          sum.map((val, i) => val + pixel[i]), [0, 0, 0]
        ).map(val => Math.round(val / cluster.length));
        centroids[index] = avgColor;
      }
    });
  }
  
  return centroids.map(([r, g, b]) => ({ r, g, b }));
};

// Calculate Euclidean distance between colors
const euclideanDistance = (color1, color2) => {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
};

// Advanced similarity calculation
const calculateAdvancedSimilarity = (features1, features2, product) => {
  let similarity = 0;
  
  // Color histogram similarity (40% weight)
  const histogramSimilarity = calculateHistogramSimilarity(features1.histogram, features2.histogram);
  similarity += histogramSimilarity * 0.4;
  
  // Brightness similarity (15% weight)
  const brightnessSimilarity = 1 - Math.abs(features1.brightness - features2.brightness) / 255;
  similarity += brightnessSimilarity * 0.15;
  
  // Contrast similarity (15% weight)
  const contrastSimilarity = 1 - Math.abs(features1.contrast - features2.contrast) / 100;
  similarity += contrastSimilarity * 0.15;
  
  // Color variance similarity (10% weight)
  const varianceSimilarity = 1 - Math.abs(features1.colorVariance - features2.colorVariance) / 100;
  similarity += varianceSimilarity * 0.1;
  
  // Dominant colors similarity (10% weight)
  const colorSimilarity = calculateColorSimilarity(features1.dominantColors, features2.dominantColors);
  similarity += colorSimilarity * 0.1;
  
  // Category bonus (10% weight)
  if (product.category) {
    similarity += 0.1;
  }
  
  return Math.min(similarity, 1);
};

// Calculate histogram similarity using intersection
const calculateHistogramSimilarity = (hist1, hist2) => {
  let intersection = 0;
  let union = 0;
  
  for (let i = 0; i < hist1.length; i++) {
    intersection += Math.min(hist1[i], hist2[i]);
    union += Math.max(hist1[i], hist2[i]);
  }
  
  return union > 0 ? intersection / union : 0;
};

// Calculate color similarity
const calculateColorSimilarity = (colors1, colors2) => {
  let totalSimilarity = 0;
  
  colors1.forEach(color1 => {
    let maxSimilarity = 0;
    colors2.forEach(color2 => {
      const distance = euclideanDistance([color1.r, color1.g, color1.b], [color2.r, color2.g, color2.b]);
      const similarity = 1 - (distance / 441.67); // Max distance is sqrt(255^2 * 3)
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });
    totalSimilarity += maxSimilarity;
  });
  
  return totalSimilarity / colors1.length;
};

// Get search statistics
export const getSearchStats = catchAsyncErrors(async (req, res, next) => {
  const totalProducts = await Product.countDocuments({ picture: { $exists: true, $ne: null } });
  
  res.status(200).json({
    success: true,
    stats: {
      totalProductsWithImages: totalProducts,
      searchCapability: totalProducts > 0 ? 'Available' : 'Not Available'
    }
  });
}); 