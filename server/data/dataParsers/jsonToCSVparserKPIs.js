import fs from 'fs';
import { Parser } from 'json2csv';

// Example `kpis` data structure (this would come from your `data1.js`)
import { kpis } from '../rawData/data'; // Make sure kpis is imported from data1.js

// Function to generate CSV from specific fields and save to a file
function generateCSV(data, fields, fileName) {
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  fs.writeFileSync(fileName, csv);
  console.log(`${fileName} has been created.`);
}

// 1. Generating overview.csv
const overviewData = kpis.map(kpi => ({
  _id: kpi._id,
  totalProfit: kpi.totalProfit,
  totalRevenue: kpi.totalRevenue,
  totalExpenses: kpi.totalExpenses,
  salaries: kpi.expensesByCategory.salaries,
  supplies: kpi.expensesByCategory.supplies,
  services: kpi.expensesByCategory.services
}));

const overviewFields = [
  '_id',
  'totalProfit',
  'totalRevenue',
  'totalExpenses',
  'salaries',
  'supplies',
  'services'
];

generateCSV(overviewData, overviewFields, 'overview.csv');

// 2. Generating monthlyData.csv
const monthlyData = [];
kpis.forEach(kpi => {
  kpi.monthlyData.forEach(monthly => {
    monthlyData.push({
      _id: kpi._id,
      month: monthly.month,
      monthlyRevenue: monthly.revenue,
      monthlyExpenses: monthly.expenses,
      operationalExpenses: monthly.operationalExpenses,
      nonOperationalExpenses: monthly.nonOperationalExpenses
    });
  });
});

const monthlyFields = [
  '_id',
  'month',
  'monthlyRevenue',
  'monthlyExpenses',
  'operationalExpenses',
  'nonOperationalExpenses'
];

generateCSV(monthlyData, monthlyFields, 'monthlyData.csv');

// 3. Generating dailyData.csv
const dailyData = [];
kpis.forEach(kpi => {
  kpi.dailyData.forEach(daily => {
    dailyData.push({
      _id: kpi._id,
      date: daily.date,
      dailyRevenue: daily.revenue,
      dailyExpenses: daily.expenses
    });
  });
});

const dailyFields = [
  '_id',
  'date',
  'dailyRevenue',
  'dailyExpenses'
];

generateCSV(dailyData, dailyFields, 'dailyData.csv');
