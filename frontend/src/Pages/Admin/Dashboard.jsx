import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  Eye,
  Clock,
  CheckCircle
} from "lucide-react";
import { toast } from "react-toastify";
import formatNumber from "format-number";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// Add socket initialization at the top level
const socket = io('http://localhost:8080');

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [adminJoined, setAdminJoined] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    socket.connect();
    console.log('[SOCKET.IO] Admin dashboard connecting to socket...');
    if (adminJoined) {
      socket.emit('joinAdmin');
      console.log('[SOCKET.IO] joinAdmin event emitted');
    }
    socket.on("connect", () => {
      console.log('[SOCKET.IO] Connected to server:', socket.id);
    });
    socket.on("lowStock", (data) => {
      console.log('[SOCKET.IO] lowStock event received:', data);
      toast.warn(`Low stock alert: ${data.title} (Stock: ${data.stock})`, { autoClose: 5000 });
    });
    return () => {
      socket.off("lowStock");
      socket.disconnect();
    };
  }, [adminJoined]);

  const fetchDashboardStats = async () => {
    try {
      console.log("Fetching dashboard stats...");
      
      // Fetch orders for stats
  const ordersResponse = await fetch("http://localhost:8080/api/v1/order/all");
      console.log("Orders response status:", ordersResponse.status);
      const ordersData = await ordersResponse.json();
      console.log("Orders data:", ordersData);

      // Fetch products count
      const productsResponse = await fetch("http://localhost:8080/api/v1/products/all");
      const productsData = await productsResponse.json();

      // Fetch users count - use the correct endpoint
      const usersResponse = await fetch("http://localhost:8080/api/v1/users/all-users", {
        credentials: "include",
      });
      const usersData = await usersResponse.json();

      if (ordersData.success) {
        const orders = ordersData.orders || [];
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const pendingOrders = orders.filter(order => order.paymentStatus === 'pending').length;
        const completedOrders = orders.filter(order => order.paymentStatus === 'paid').length;
        
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: productsData.success ? (productsData.products?.length || 0) : 0,
          totalCustomers: usersData.success ? (usersData.users?.filter(user => user.role !== 1)?.length || 0) : new Set(orders.map(order => order.customerEmail)).size,
          recentOrders: orders.slice(0, 5),
          pendingOrders,
          completedOrders
        });
        
        console.log("Dashboard stats updated:", {
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: productsData.success ? (productsData.products?.length || 0) : 0,
          totalCustomers: usersData.success ? (usersData.users?.filter(user => user.role !== 1)?.length || 0) : new Set(orders.map(order => order.customerEmail)).size,
          pendingOrders,
          completedOrders
        });
      } else {
        console.error("Failed to fetch orders:", ordersData.message);
        toast.error("Error fetching dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-orange-500"
          subtitle="All time orders"
        />
        <StatCard
          title="Total Revenue"
          value={formatNumber({ prefix: "PKR " })(stats.totalRevenue)}
          icon={DollarSign}
          color="bg-green-500"
          subtitle="Total earnings"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
          subtitle="Active products"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-purple-500"
          subtitle="Unique customers"
        />
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.completedOrders}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-600 mt-1">Latest customer orders</p>
        </div>
        <div className="p-6">
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customerName || "Guest"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.cartItems?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        ID: {order._id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">
                      {formatNumber({ prefix: "PKR " })(order.totalAmount)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600">Orders will appear here once customers start shopping.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="bg-orange-600 hover:bg-orange-700 h-12"
            onClick={() => navigate("/admin/products")}
          >
            <Package className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button 
            variant="outline" 
            className="h-12 border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={() => navigate("/admin/orders")}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Orders
          </Button>
          <Button 
            variant="outline" 
            className="h-12 border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={() => navigate("/admin/users")}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
