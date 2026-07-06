/** GET /admin/stats/dashboard payload, mirroring the backend `DashboardStats`.
 * Money is minor units (pesewas). */
export interface IDashboardStats {
  shop: {
    ordersToday: number;
    pendingOrders: number;
    readyOrders: number;
    outstandingBalance: number;
    weekRevenue: number;
    weekRevenueByDay: { day: string; total: number }[];
    bestSellers: { name: string; quantity: number }[];
  };
  bakeSchool: {
    pendingApplications: number;
    activeStudents: number;
    openCohort: {
      id: string;
      name: string;
      capacity: number | null;
      applications: number;
      students: number;
    } | null;
  };
  recentActivity: {
    action: string;
    entity: string;
    actor: string | null;
    at: string;
  }[];
}

export interface IDashboardStatsResponse {
  message: string;
  data: IDashboardStats;
}
