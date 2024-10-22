import { Readable } from 'stream';
import csv from 'csv-parser';

// Helper function to parse CSV from buffer
function parseCSVFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer); // Pass buffer directly to the stream
    
    stream
      .pipe(csv())
      .on('data', (data) => {
        // console.log("Raw CSV Data:", data);  // Log raw data from CSV
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Convert transaction CSV buffer to JSON
function convertTransactionsToJson(transactions) {
  return transactions.map(transaction => ({
    _id: transaction._id,
    amount: transaction.amount,
    buyer: transaction.buyer,
    productIds: transaction.productIds.split(', ').map(id => id.trim()), // Array of product IDs
  }));
}

// Function to process transaction CSV buffer
export async function parseTransactions(transactionBuffer) {
  try {
    console.log("Received Transaction Buffer:", transactionBuffer);
    
    const transactionsData = await parseCSVFromBuffer(transactionBuffer);
    console.log("Parsed Transactions Data:", transactionsData);
    
    const transactionsJson = convertTransactionsToJson(transactionsData);
    return transactionsJson;
  } catch (error) {
    console.error('Error processing transaction data:', error);
  }
}
