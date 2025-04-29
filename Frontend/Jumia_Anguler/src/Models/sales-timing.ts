export interface BestDay {
  day: string;
  totalOrders: number;
}

export interface BestHour {
  hour: number;
  totalOrders: number;
}

export interface BestSalesTime {
  bestDays: BestDay[];
  bestHours: BestHour[];
}
