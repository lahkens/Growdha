import { Readable } from 'stream';
import csv from 'csv-parser';

// Helper function to parse CSV from buffer
function parseCSVFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString('utf-8').split('\n')); // Create a readable stream from the buffer
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}
// Convert product CSV buffer to JSON
function convertProductsToJson(products) {
    return products.map(product => ({
      _id: product._id,
      price: product.price,
      expense: product.expense,
      transactions: product.transactions.split(', ').map(id => id.trim()), // Array of transaction IDs
    }));
  }
  
  // Function to process product CSV buffer
  export async function parseProducts(productBuffer) {
    try {
      const productsData = await parseCSVFromBuffer(productBuffer);
      const productsJson = convertProductsToJson(productsData);
      return productsJson; // Return the array of objects directly
    } catch (error) {
      console.error('Error processing product data:', error);
    }
  }
  