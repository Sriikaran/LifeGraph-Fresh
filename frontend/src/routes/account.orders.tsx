import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useOrders } from "@/lib/orders";
import { useAuth } from "@/lib/auth";
import { inr } from "@/lib/format";
import { getProductImage, handleProductImageError } from "@/lib/imageFallbacks";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { user, loading } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { returnUrl: router.latestLocation.pathname }, replace: true });
    }
  }, [user, loading, navigate, router.latestLocation.pathname]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/account" className="hover:underline hover:text-[#c45500]">Your Account</Link>
        <span>›</span>
        <span className="text-[#c45500]">Your Orders</span>
      </div>
      
      <h1 className="text-3xl font-medium mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="border rounded-lg p-8 text-center bg-white shadow-sm">
          <p className="text-lg text-gray-600 mb-4">Your orders will appear here.</p>
          <Link to="/" className="text-[#007185] hover:text-[#c45500] hover:underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-100 p-4 border-b flex flex-wrap gap-6 text-sm text-gray-600">
                <div>
                  <div className="uppercase text-xs font-bold mb-1">Order Placed</div>
                  <div>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div>
                  <div className="uppercase text-xs font-bold mb-1">Total</div>
                  <div>₹{inr(order.total)}</div>
                </div>
                <div>
                  <div className="uppercase text-xs font-bold mb-1">Dispatch To</div>
                  <div className="text-[#007185] hover:underline cursor-pointer">{order.address.fullName}</div>
                </div>
                <div className="ml-auto text-right flex-1">
                  <div className="uppercase text-xs font-bold mb-1">Order # {order.id}</div>
                  <div className="text-[#007185] hover:underline cursor-pointer">View order details</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-green-700 mb-4">
                  Arriving {new Date(new Date(order.date).getTime() + 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 shrink-0">
                        <img src={getProductImage(item.product.image, item.product.category)} alt={item.product.title} className="max-h-full max-w-full object-contain" onError={(e) => handleProductImageError(e, item.product.category)} />
                      </div>
                      <div className="flex-1">
                        <Link to="/product/$id" params={{ id: item.product.id }} className="text-[#007185] hover:text-[#c45500] hover:underline font-medium">
                          {item.product.title}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">Sold by: {item.product.brand} Official</div>
                        <div className="text-sm font-bold mt-1 text-[#B12704]">₹{inr(item.product.price)}</div>
                        <div className="text-sm mt-1">Quantity: {item.qty}</div>
                        
                        <div className="mt-3 flex gap-2">
                          <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm rounded-lg px-4 py-1.5 font-medium shadow-sm border border-[#FCD200]">
                            Buy it again
                          </button>
                          <button className="bg-white hover:bg-gray-50 text-black text-sm rounded-lg px-4 py-1.5 font-medium shadow-sm border border-gray-300">
                            View your item
                          </button>
                        </div>
                      </div>
                      <div className="hidden md:block w-48 text-right">
                        <button className="w-full bg-white hover:bg-gray-50 text-black text-sm rounded-lg px-4 py-1.5 font-medium shadow-sm border border-gray-300 mb-2">
                          Track package
                        </button>
                        <button className="w-full bg-white hover:bg-gray-50 text-black text-sm rounded-lg px-4 py-1.5 font-medium shadow-sm border border-gray-300">
                          Leave seller feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
