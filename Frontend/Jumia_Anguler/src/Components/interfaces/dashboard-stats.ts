
export interface DashboardStats {
    totalOrders: number;
    totalStores: number;
    confirmedOrders: number;
    canceledOrders: number;
    totalProducts: number;
    packagingOrders: number;
    returnedOrders: number;
    totalCustomers: number;
    outForDelivery: number;
    failedDelivery: number;
    adminWallet: number;
    commissionEarned: number;
    deliveryChargeEarned: number;
  }
  
  export interface Order {
    id: number;
    customer: string;
    date: string;
    status: string;
    amount: number;
  }