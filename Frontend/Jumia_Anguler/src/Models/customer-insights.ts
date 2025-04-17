export interface CustomerInsights {
    totalCustomers: number;
    topCustomers: { customerFirstName: string; customerLastName: string; ordersCount: number }[];
  }
  