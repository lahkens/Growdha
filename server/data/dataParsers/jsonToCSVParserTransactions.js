import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transactions } from '../rawData/data.js';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert JSON to CSV format
function jsonToCSV(transactions) {
  const csvLines = [];
  // Add header row
  csvLines.push('_id,amount,buyer,productIds');
  
  transactions.forEach(transaction => {
    // Join productIds into a string separated by commas
    const productIdsString = transaction.productIds.join(', ');
    // Create a line for each transaction
    csvLines.push(`${transaction._id},${transaction.amount},${transaction.buyer},"${productIdsString}"`);
  });

  return csvLines.join('\n');
}

// Function to save transactions to CSV
async function saveTransactionsToCSV() {
  try {
    const rawDataPath = path.join(__dirname, '../rawData');

    const csvOutput = jsonToCSV(transactions);
    await fs.promises.writeFile(path.join(rawDataPath, 'transactions.csv'), csvOutput);
    console.log('transactions.csv has been created successfully.');
  } catch (error) {
    console.error('Error saving transactions to CSV:', error);
  }
}

// Run the save process
saveTransactionsToCSV();
