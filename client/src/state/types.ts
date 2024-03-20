export interface ExpensesByCategory{
    salaries: number;
    services: number;
    supplies: number;
}


export interface Month{
    expenses: number;
    id: string;
    month: string;
    nonOperationalExpenses: number;
    operationalExpenses: number;
    revenue: number;
    _id: string;

}

export interface Day{
    expenses: number;
    id: string;
    date: string;
    revenue: number;
    _id: string;

}



export interface GetKpisResponse{
    id: string;
    _id: string;
    __v: number;
    totalProfit: number;
    totalRevenue: number;
    totalExpenses: number;
    expensesByCategory: ExpensesByCategory;
    dailyData: Array<Day>;
    monthlyData: Array<Month>;
    createdAt: string;
    updatedAt: string;
}

export interface GetProductsResponse{
    id: string;
    _id: string;
    __v: number;
    price: number;
    expense: number;
    transactions: Array<string>;
    createdAt: string;
    updatedAt: string
    
}

export interface GetTransactionsResponse{
    id: string;
    _id: string;
    __v: number;
    buyer: number;
    amount: number;
    productIds: Array<string>;
    createdAt: string;
    updatedAt: string
    
}
