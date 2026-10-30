import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import { authState } from "@/plugins/auth";

import Dashboard from "@/pages/Dashboard.vue";
import OrdersList from "@/pages/OrdersList.vue";
import DeliveryAgentsList from "@/pages/DeliveryAgentsList.vue";
import Traders from "@/pages/Traders.vue";
import Users from "@/pages/Users.vue";
import Login from "@/pages/Login.vue";
import Reports from "@/pages/Reports.vue";
import TradersFinancialReport from "@/pages/TradersFinancialReport.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Sign in" },
  },
  {
    path: "/",
    component: DashboardLayout,
    // admins start on the Dashboard, other users on Orders
    redirect: () => (authState.role && authState.role !== "ADMIN" ? "/orders" : "/dashboard"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { adminOnly: true },
      },
      {
        path: "orders",
        name: "Orders List",
        component: OrdersList,
        meta: { title: "Orders" },
      },
      {
        path: "delivery-agents",
        name: "Delivery Agents",
        component: DeliveryAgentsList,
      },
      {
        path: "traders",
        name: "Traders",
        component: Traders,
      },
      {
        path: "users",
        name: "Users",
        component: Users,
        meta: { adminOnly: true },
      },
      {
        path: "reports",
        name: "Reports",
        component: Reports,
      },
      {
        path: "traders-financial-report",
        name: "Traders Financial Report",
        component: TradersFinancialReport,
        meta: { adminOnly: true },
      },
    ],
  },
  // unknown URLs go to the dashboard (or login, via the auth guard)
  { path: "*", redirect: "/" },
];

export default routes;
