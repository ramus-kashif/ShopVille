import { Card, CardContent } from "./ui/card";
import formatNumber from "format-number";
import { FaCartPlus } from "react-icons/fa";

function ProductCard({ product }) {
  return (
    <div className="block w-full max-w-sm sm:max-w-xs mx-auto px-2 sm:px-4">
      <Card className="rounded-xl shadow-lg w-full bg-white hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 border border-gray-100">
        <CardContent className="grid gap-3">
          <div className="relative flex justify-center items-center bg-gray-50 rounded-t-xl h-48 sm:h-56 overflow-hidden">
            <img
              src={product.picture?.secure_url || "/images/placeholder.png"}
              alt={product.title}
              className="h-full w-full object-contain p-4 transition-transform duration-200 hover:scale-105"
              draggable="false"
              loading="lazy"
            />
            {/* Example badge, can be dynamic */}
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10 select-none">
              New
            </span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            <h5
              className="text-base font-bold tracking-tight text-gray-900 truncate"
              title={product.title}
            >
              {product.title}
            </h5>
            <p className="text-gray-500 text-xs mb-2 line-clamp-2 min-h-[32px]">
              {product.description}
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-end gap-2 flex-wrap">
                {product.discount > 0 ? (
                  <>
                    <span className="line-through text-gray-400 text-sm">
                      {formatNumber({ prefix: "PKR. " })(product.price)}
                    </span>
                    <span className="text-base font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg shadow-sm">
                      {formatNumber({
                        prefix: "PKR. ",
                      })(
                        product.price - (product.price * product.discount) / 100
                      )}
                    </span>
                    <span className="text-green-600 text-xs font-bold">
                      ({product.discount}% OFF)
                    </span>
                  </>
                ) : (
                  <span className="text-base font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg shadow-sm">
                    {formatNumber({ prefix: "PKR. " })(product.price) || 0}
                  </span>
                )}
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-3 py-1.5 rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300 z-10 text-sm w-full">
                <FaCartPlus className="text-base" /> Add to cart
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductCard;
