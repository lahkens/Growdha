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

// Convert CSV data to JSON format
function convertTransactionsToJson(transactions) {
  return transactions.map(transaction => {
    return {
      _id: transaction._id,
      amount: transaction.amount,
      buyer: transaction.buyer,
      productIds: transaction.productIds.split(', ').map(id => id.trim()),
    };
  });
}

// Function to convert JSON to a string in the desired format
function convertToJsObject(transactions) {
  let output = 'export const transactions = [\n';
  
  transactions.forEach(transaction => {
    output += `  {\n`;
    output += `    _id: "${transaction._id}",\n`;
    output += `    amount: "${transaction.amount}",\n`;
    output += `    buyer: "${transaction.buyer}",\n`;
    output += `    productIds: [\n`;
    transaction.productIds.forEach(id => {
      output += `      "${id}",\n`;
    });
    output += `    ],\n`;
    output += `  },\n`;
  });

  output += '];\n';
  return output;
}

// Function to read transactions CSV, convert to JSON, and append to data1.js
async function loadTransactionsFromCSV() {
  try {
    const rawDataPath = path.join(__dirname, '../rawData');
    
    // Read the transactions CSV file
    const transactionsData = await readCSV(path.join(rawDataPath, 'transactions.csv'));
    
    // Convert to JSON format
    const transactionsJson = convertTransactionsToJson(transactionsData);

    // Convert JSON to the desired string format
    const output = convertToJsObject(transactionsJson);

    // Append to data1.js
    await fs.promises.appendFile(path.join(rawDataPath, 'data1.js'), output);
    console.log('data1.js has been updated with new transactions array.');
  } catch (error) {
    console.error('Error loading transactions from CSV:', error);
  }
}

// Run the load process
loadTransactionsFromCSV();
