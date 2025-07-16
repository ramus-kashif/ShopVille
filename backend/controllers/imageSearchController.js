import Product from '../models/productsModel.js';
import sharp from 'sharp';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Helper: Compute grayscale histogram
const getHistogram = async (buffer) => {
  const resized = await sharp(buffer).resize(64, 64).greyscale().raw().toBuffer();
  const hist = new Array(256).fill(0);
  for (let i = 0; i < resized.length; i++) {
    hist[resized[i]]++;
  }
  // Normalize
  const total = resized.length;
  return hist.map((v) => v / total);
};

// Helper: Histogram intersection
const histogramSimilarity = (h1, h2) => {
  let sum = 0;
  for (let i = 0; i < h1.length; i++) {
    sum += Math.min(h1[i], h2[i]);
  }
  return sum;
};

export const imageSearchHandler = async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  const imageBuffer = req.file.buffer;
  let fallbackUsed = false;
  let similarProducts = [];
  let message = '';

  // 1. Try Python microservice
  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: 'image.jpg' });
    const pyRes = await fetch('http://localhost:5001/search', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(), // <-- THIS IS CRITICAL
    });
    if (pyRes.ok) {
      const data = await pyRes.json();
      console.log("PYTHON SERVICE RESPONSE:", data); // Debug log
      // data: { productIds: [id1, id2, ...] }
      if (data.productIds && Array.isArray(data.productIds)) {
        similarProducts = await Product.find({ _id: { $in: data.productIds } }).populate('category');
        message = `Deep learning image search successful. Found ${data.totalFound} similar products${data.threshold ? ` (similarity threshold: ${Math.round(data.threshold * 100)}%)` : ''}${data.note ? ` - ${data.note}` : ''}`;
        return res.status(200).json({ 
          success: true, 
          products: similarProducts, 
          totalResults: similarProducts.length, 
          message, 
          fallbackUsed,
          similarities: data.similarities || [],
          threshold: data.threshold
        });
      }
    }
    // If Python service returns error, fall through to fallback
    fallbackUsed = true;
    message = 'Python service did not return valid results, using fallback.';
  } catch (err) {
    fallbackUsed = true;
    message = 'Python service unavailable, using fallback.';
  }

  // 2. Fallback: Color histogram similarity
  try {
    const uploadedHist = await getHistogram(imageBuffer);
    const products = await Product.find({ 'picture.secure_url': { $exists: true, $ne: null } }).populate('category');
    const scored = [];
    for (const product of products) {
      try {
        const resp = await fetch(product.picture.secure_url);
        if (!resp.ok) continue;
        const buf = Buffer.from(await resp.arrayBuffer());
        const hist = await getHistogram(buf);
        const sim = histogramSimilarity(uploadedHist, hist);
        scored.push({ product, sim });
      } catch {}
    }
    scored.sort((a, b) => b.sim - a.sim);
    similarProducts = scored.slice(0, 4).map((x) => x.product);
    message = message || 'Fallback image search used.';
    return res.status(200).json({ success: true, products: similarProducts, totalResults: similarProducts.length, message, fallbackUsed });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Image search failed.' });
  }
}; 