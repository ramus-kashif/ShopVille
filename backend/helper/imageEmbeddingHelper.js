import axios from 'axios';

/**
 * Sends an image buffer to the Python microservice and returns the embedding vector.
 * @param {Buffer} imageBuffer - The image buffer to embed.
 * @returns {Promise<number[]>} - The embedding vector.
 */
export async function getImageEmbedding(imageBuffer) {
  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, 'image.jpg');
    const response = await axios.post('http://localhost:8001/embed', formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data.embedding;
  } catch (error) {
    console.error('Error getting image embedding:', error.message);
    throw error;
  }
} 