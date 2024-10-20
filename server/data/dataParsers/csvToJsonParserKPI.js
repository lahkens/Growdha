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
// Convert KPI CSV buffer to JS object
function convertKPIToJsObject(kpis) {
    return kpis.map(kpi => ({
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
  }
  
  // Function to process CSV buffers and combine KPI data
  export async function parseKPI(kpiBuffer, dailyDataBuffer, monthlyDataBuffer) {
    try {
      const overview = await parseCSVFromBuffer(kpiBuffer);
      const dailyData = await parseCSVFromBuffer(dailyDataBuffer);
      const monthlyData = await parseCSVFromBuffer(monthlyDataBuffer);
  
      const kpis = overview.map(overviewEntry => {
        const _id = overviewEntry._id;
  
        const monthlyEntries = monthlyData.filter(monthly => monthly._id === _id)
          .map(monthly => ({
            month: monthly.month,
            revenue: String(monthly.monthlyRevenue),
            expenses: String(monthly.monthlyExpenses),
            operationalExpenses: String(monthly.operationalExpenses),
            nonOperationalExpenses: String(monthly.nonOperationalExpenses)
          }));
  
        const dailyEntries = dailyData.filter(daily => daily._id === _id)
          .map(daily => ({
            date: daily.date,
            revenue: String(daily.dailyRevenue),
            expenses: String(daily.dailyExpenses)
          }));
  
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
  
      return kpis; // Return the array of objects directly
    } catch (error) {
      console.error('Error processing KPI data:', error);
    }
  }
  