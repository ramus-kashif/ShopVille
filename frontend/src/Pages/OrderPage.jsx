import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/store/features/cart/cartSlice";

function OrderPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?._id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/v1/order/user/${user._id}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          console.log("Fetched orders:", data.orders);
          if (data.orders && data.orders.length > 0) {
            console.log("First order structure:", data.orders[0]);
            console.log("First order cartItems:", data.orders[0].cartItems);
          }
        }
      } catch {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user, dispatch]);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center px-4"><div className="text-center text-lg">Loading orders...</div></div>;
  }
  if (!orders.length) {
    return <div className="min-h-screen bg-white flex items-center justify-center px-4"><div className="text-center text-lg text-gray-500">No orders found.</div></div>;
  }
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#FF6B00] mb-2">My Orders</h1>
          <p className="text-lg text-[#6C757D]">Review your past purchases and details</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6 border border-[#E0E0E0] hover:border-[#FF6B00]/30 transition-all duration-300">
              <div className="mb-2 text-lg font-semibold text-gray-800 flex justify-between items-center">
                <span><strong>Order ID:</strong> {order._id}</span>
                <span className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm' : 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm'}>{order.paymentStatus ?? "N/A"}</span>
              </div>
              <div className="mb-2"><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</div>
              <div className="mb-2"><strong>Total:</strong> <span className="text-[#FF6B00] font-bold">PKR {order.totalAmount ?? "N/A"}</span></div>
              <div className="mb-2"><strong>Payment Method:</strong> {order.paymentMethod ?? "N/A"}</div>
              <div className="mb-2"><strong>Shipment Address:</strong>
                {order.shipmentAddress ? (
                  <div className="ml-4 text-sm text-gray-700">
                    <div>{order.shipmentAddress.name ?? ""}</div>
                    <div>{order.shipmentAddress.phone ?? ""}</div>
                    <div>{order.shipmentAddress.address ?? ""}</div>
                    <div>{order.shipmentAddress.city ?? ""} {order.shipmentAddress.postalCode ?? ""}</div>
                  </div>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>
              <div className="mb-2"><strong>Items:</strong>
                {order.cartItems && order.cartItems.length > 0 ? (
                  <ul className="divide-y divide-[#E0E0E0] mt-2">
                    {order.cartItems.map(item => (
                      <li key={item.productId} className="py-2 flex items-center gap-4">
                        {item.pictureUrl && <img src={item.pictureUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg shadow-sm" />}
                        <div className="flex-1">
                          <div className="font-semibold text-[#1C1C1E]">{item.title}</div>
                          <div className="text-sm text-[#6C757D]">Qty: {item.quantity} × PKR {item.price}</div>
                        </div>
                        <div className="font-semibold text-[#FF6B00]">PKR {item.price * item.quantity}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 ml-6">No items in this order.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderPage;