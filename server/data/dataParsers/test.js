import { Readable } from 'stream';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read CSV from file path
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

// Convert transaction CSV data to JSON
function convertTransactionsToJson(transactions) {
  return transactions.map(transaction => ({
    _id: transaction._id,
    amount: transaction.amount,
    buyer: transaction.buyer,
    productIds: transaction.productIds.split(', ').map(id => id.trim()), // Array of product IDs
  }));
}

// Function to process CSV file and write to data1.js
export async function parseTransactions() {
  try {
    const rawDataPath = path.join(__dirname, '../rawData'); // Adjust the path as needed
    const transactions = await readCSV(path.join(rawDataPath, 'transactions.csv'));

    const transactionsJson = convertTransactionsToJson(transactions);

    // Convert the transactionsJson to a JavaScript file content string
    const output = `export const transactions = ${JSON.stringify(transactionsJson, null, 2)};\n`;

    // Write to data1.js
    const outputPath = path.join(rawDataPath, 'data1.js');
    await fs.promises.appendFile(outputPath, output);
    console.log('data1.js has been updated with new transactions array.');

    return transactionsJson;
  } catch (error) {
    console.error('Error processing transaction data:', error);
  }
}

// Run the function to process the transactions CSV and write to data1.js
parseTransactions();
