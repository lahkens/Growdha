import fs from 'fs';
import csv from 'csv-parser'; 
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read CSV data
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Convert products CSV data to JavaScript object format
function convertProductsToJsObject(products) {
  let output = 'export const products = [\n';
  
  products.forEach(product => {
    output += `  {\n`;
    output += `    _id: "${product._id}",\n`;
    output += `    price: "${product.price}",\n`;
    output += `    expense: "${product.expense}",\n`;
    
    // Split transactions into an array
    const transactionsArray = product.transactions.split(', ').map(transaction => `"${transaction}"`);
    
    output += `    transactions: [\n      ${transactionsArray.join(',\n      ')},\n    ],\n`;
    output += `  },\n`;
  });

  output += '];\n';
  return output;
}

// Function to convert product CSV data and append to data1.js
async function combineAndAppendProductData() {
  try {
    const rawDataPath = path.join(__dirname, '../rawData');

    // Read the products CSV file
    const productsData = await readCSV(path.join(rawDataPath, 'products.csv'));

    // Convert products data to JS object format
    const output = convertProductsToJsObject(productsData);
    
    // Append the output to data1.js
    await fs.promises.appendFile(path.join(rawDataPath, 'data1.js'), output);
    console.log('data1.js has been updated with new products array.');
  } catch (error) {
    console.error('Error combining product CSV data:', error);
  }
}

// Run the combine and append process
combineAndAppendProductData();
