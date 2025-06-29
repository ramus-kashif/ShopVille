import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSingleProduct } from "@/store/features/products/productSlice";
import formatNumber from 'format-number';     

function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState({
    title: "",
    category: "",
    picture: "",
    description: "",
    price: "",
  });
  const dispatch = useDispatch();
  const { productId } = useParams();
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  useEffect(() => {
    dispatch(getSingleProduct(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    if (products && products.product) {
      setProductDetails(products.product);
    }
  }, [products]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-full">
        Loading Products...
      </div>
    );
  if (error == "error")
    return (
      <div className="flex justify-center items-center h-full">
        Error while fetching Product...
      </div>
    );

  return (
    <div className="container py-10 px-4 mx-auto min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100">
      <h1 className="text-center text-5xl py-7 font-extrabold tracking-tight text-gray-900 drop-shadow-lg">
        Product Details
      </h1>
      <div className="flex flex-col md:flex-row gap-12 md:gap-8 py-8 max-w-5xl mx-auto bg-white/80 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="md:w-1/2 w-full flex items-center justify-center p-6 bg-transparent">
          <img 
            src={productDetails.picture.secure_url} 
            alt={productDetails.title} 
            className="object-contain h-96 w-auto max-w-xs md:max-w-sm rounded-xl shadow-none transition-transform duration-300 hover:scale-105 bg-transparent"
            style={{ boxShadow: 'none', background: 'transparent' }}
          />
        </div>
        <div className="md:w-1/2 w-full flex flex-col justify-center gap-6 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            {productDetails.title}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-2">
            <span className="capitalize text-lg">Price:</span>
            {productDetails.discount > 0 ? (
              <>
                <span className="line-through text-gray-400 text-xl mr-2">{formatNumber()(productDetails.price)}</span>
                <span className="font-semibold text-orange-600 text-2xl bg-orange-50 px-2 py-1 rounded-lg shadow-sm">{formatNumber()(productDetails.price - Math.round(productDetails.price * productDetails.discount / 100))}</span>
                <span className="ml-2 text-green-600 text-base font-bold">({Math.round(productDetails.discount)}% OFF)</span>
              </>
            ) : (
              <span className="font-semibold text-orange-600 text-2xl bg-orange-50 px-2 py-1 rounded-lg shadow-sm">{formatNumber()(productDetails.price)}</span>
            )}
            {/* <span className="text-gray-400 ml-1 align-top" style={{ fontSize: "14px" }}>
              PKR/Item
            </span> */}
          </div>
          <p className="capitalize mb-2 text-lg">
            Category: <span className="font-semibold text-orange-500">{productDetails.category?.name || "N/A"}</span>
          </p>
          <p className="capitalize mb-4 text-gray-700 text-base leading-relaxed">{productDetails.description}</p>
          <div className="mb-4 flex gap-2 items-center">
            <button
              onClick={handleDecrement}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-lg font-bold rounded-lg shadow-sm transition-colors"
            >
              -
            </button>
            <input
              type="number"
              className="w-14 border-0 bg-gray-100 text-center py-1.5 rounded-lg text-lg font-semibold focus:outline-none"
              readOnly
              value={quantity}
              min={1}
            />
            <button
              onClick={handleIncrement}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-lg font-bold rounded-lg shadow-sm transition-colors"
            >
              +
            </button>
          </div>
          <button className="w-full bg-orange-400 hover:bg-orange-500 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
