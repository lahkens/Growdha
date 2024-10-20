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


// Convert transaction CSV buffer to JSON
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
      const transactionsData = await parseCSVFromBuffer(transactionBuffer);
      const transactionsJson = convertTransactionsToJson(transactionsData);
      return transactionsJson; // Return the array of objects directly
    } catch (error) {
      console.error('Error processing transaction data:', error);
    }
  }
  