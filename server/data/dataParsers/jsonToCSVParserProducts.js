import fs from 'fs';
import { Parser } from 'json2csv';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../rawData/data.js'; // Importing products array

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually flattening and processing the products array for CSV export
function prepareProductsData(products) {
  return products.map(product => ({
    _id: product._id,
    price: product.price,
    expense: product.expense,
    transactions: product.transactions.join(', '), // Convert transactions array into comma-separated string
  }));
}

function convertProductsToCSV() {
  try {
    // Prepare products data for CSV
    const productsData = prepareProductsData(products);

    // Define fields for CSV
    const fields = ['_id', 'price', 'expense', 'transactions'];
    const opts = { fields };

    // Create CSV parser instance
    const parser = new Parser(opts);
    const csv = parser.parse(productsData);

    // Write CSV to file
    const outputFilePath = path.join(__dirname, '../rawData/products.csv');
    fs.writeFileSync(outputFilePath, csv);
    
    console.log('CSV file has been successfully created at', outputFilePath);
  } catch (err) {
    console.error('Error generating CSV file:', err);
  }
}

// Run the conversion function
convertProductsToCSV();
