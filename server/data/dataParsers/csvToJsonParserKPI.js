import fs from 'fs';
import csv from 'csv-parser'; 
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read CSV data from rawData directory
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

// Manually construct string for JavaScript object instead of JSON.stringify
function convertToJsObject(kpis) {
  let output = 'export const kpis = [\n';
  
  kpis.forEach(kpi => {
    output += `  {\n`;
    output += `    _id: "${kpi._id}",\n`;
    output += `    totalProfit: "${kpi.totalProfit}",\n`;
    output += `    totalRevenue: "${kpi.totalRevenue}",\n`;
    output += `    totalExpenses: "${kpi.totalExpenses}",\n`;
    
    output += `    monthlyData: [\n`;
    kpi.monthlyData.forEach(monthly => {
      output += `      { month: "${monthly.month}", revenue: "${monthly.revenue}", expenses: "${monthly.expenses}", operationalExpenses: "${monthly.operationalExpenses}", nonOperationalExpenses: "${monthly.nonOperationalExpenses}" },\n`;
    });
    output += `    ],\n`;

    output += `    dailyData: [\n`;
    kpi.dailyData.forEach(daily => {
      output += `      { date: "${daily.date}", revenue: "${daily.revenue}", expenses: "${daily.expenses}" },\n`;
    });
    output += `    ],\n`;

    output += `    expensesByCategory: {\n`;
    output += `      salaries: "${kpi.expensesByCategory.salaries}",\n`;
    output += `      supplies: "${kpi.expensesByCategory.supplies}",\n`;
    output += `      services: "${kpi.expensesByCategory.services}"\n`;
    output += `    }\n`;

    output += `  },\n`;
  });

  output += '];\n';
  return output;
}

// Function to convert CSV data back to `kpis` structure and write to file
async function combineAndConvertData() {
  try {
    const rawDataPath = path.join(__dirname, '../rawData');

    const overview = await readCSV(path.join(rawDataPath, 'overview.csv'));
    const monthlyData = await readCSV(path.join(rawDataPath, 'monthlyData.csv'));
    const dailyData = await readCSV(path.join(rawDataPath, 'dailyData.csv'));

    const kpis = overview.map(overviewEntry => {
      const _id = overviewEntry._id;

      // Collect all monthly data related to this _id
      const monthlyEntries = monthlyData
        .filter(monthlyEntry => monthlyEntry._id === _id)
        .map(monthlyEntry => ({
          month: monthlyEntry.month,
          revenue: String(monthlyEntry.monthlyRevenue),
          expenses: String(monthlyEntry.monthlyExpenses),
          operationalExpenses: String(monthlyEntry.operationalExpenses),
          nonOperationalExpenses: String(monthlyEntry.nonOperationalExpenses)
        }));

      // Collect all daily data related to this _id
      const dailyEntries = dailyData
        .filter(dailyEntry => dailyEntry._id === _id)
        .map(dailyEntry => ({
          date: dailyEntry.date,
          revenue: String(dailyEntry.dailyRevenue),
          expenses: String(dailyEntry.dailyExpenses)
        }));

      // Build the kpi object
      return {
        _id: _id,
        totalProfit: String(overviewEntry.totalProfit),
        totalRevenue: String(overviewEntry.totalRevenue),
        totalExpenses: String(overviewEntry.totalExpenses),
        monthlyData: monthlyEntries,
        dailyData: dailyEntries,
        expensesByCategory: {
          salaries: String(overviewEntry.salaries),
          supplies: String(overviewEntry.supplies),
          services: String(overviewEntry.services)
        }
      };
    });

    // Convert the `kpis` array to manually formatted JS object string
    const output = convertToJsObject(kpis);
    
    // Use fs.promises.appendFile to append to the file
    await fs.promises.appendFile(path.join(rawDataPath, 'data1.js'), output);
    console.log('data1.js has been updated with new kpis array.');
  } catch (error) {
    console.error('Error combining CSV data:', error);
  }
}

// Run the combine and convert process
combineAndConvertData();
