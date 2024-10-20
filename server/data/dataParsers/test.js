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

    // Create kpiData using the structured mapping
    const kpiData = kpis.map(kpi => ({
      _id: kpi._id,
      totalProfit: kpi.totalProfit,
      totalRevenue: kpi.totalRevenue,
      totalExpenses: kpi.totalExpenses,
      monthlyData: kpi.monthlyData.map(monthly => ({
        month: monthly.month,
        revenue: monthly.revenue,
        expenses: monthly.expenses,
        operationalExpenses: monthly.operationalExpenses,
        nonOperationalExpenses: monthly.nonOperationalExpenses
      })),
      dailyData: kpi.dailyData.map(daily => ({
        date: daily.date,
        revenue: daily.revenue,
        expenses: daily.expenses
      })),
      expensesByCategory: {
        salaries: kpi.expensesByCategory.salaries,
        supplies: kpi.expensesByCategory.supplies,
        services: kpi.expensesByCategory.services
      }
    }));

    // Convert kpiData to JSON string format
    const output = `export const kpis = ${JSON.stringify(kpiData, null, 2)};\n`;

    // Use fs.promises.appendFile to append to the file
    await fs.promises.appendFile(path.join(rawDataPath, 'data1.js'), output);
    console.log('data1.js has been updated with new kpis array.');
  } catch (error) {
    console.error('Error combining CSV data:', error);
  }
}

// Run the combine and convert process
combineAndConvertData();
