import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import formatNumber from "format-number";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders from backend...");
  const response = await fetch("http://localhost:8080/api/v1/order/all");
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Orders data:", data);
      
      if (data.success) {
        setOrders(data.orders || []);
        console.log(`Loaded ${data.orders?.length || 0} orders`);
      } else {
        toast.error("Failed to fetch orders");
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "stripe":
        return "bg-blue-100 text-blue-700";
      case "cod":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-white p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-4">
            Orders will appear here once customers place them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="text-sm text-gray-500">
          Total: {orders.length} orders
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-orange-50 border-b border-orange-200">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Items</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Payment</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-orange-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-gray-600">#{order._id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{order.customerName || "Guest"}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {order.cartItems?.length || 0} items
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-orange-600">
                      {formatNumber({ prefix: "PKR " })(order.totalAmount)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(order.paymentMethod)}`}>
                      {order.paymentMethod?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedOrder(order)}
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Order ID:</span>
                  <p className="text-sm text-gray-900 font-mono">#{selectedOrder._id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Date:</span>
                  <p className="text-sm text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Customer:</span>
                  <p className="text-sm text-gray-900">{selectedOrder.customerName || "Guest"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(selectedOrder.paymentMethod)}`}>
                    {selectedOrder.paymentMethod?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.cartItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.pictureUrl || "/placeholder.png"} 
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatNumber({ prefix: "PKR " })(item.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: {formatNumber({ prefix: "PKR " })(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatNumber({ prefix: "PKR " })(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
