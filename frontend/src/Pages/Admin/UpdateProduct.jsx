import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/store/features/categories/categoriesSlice";
import {
  getSingleProduct,
  updateSingleProduct,
} from "@/store/features/products/productSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateProduct() {
  const [inputValues, setInputValues] = useState({
    title: "",
    price: "",
    discount: "",
    category: "", // always a string
    picture: "",
    description: "",
  });

  const [prevPic, setPrevPic] = useState("");
  const categories = useSelector((state) => state.categories.categories);
  const catStatus = useSelector((state) => state.categories.status);
  const catError = useSelector((state) => state.categories.error);

  const products = useSelector((state) => state.products.products);
  const prodStatus = useSelector((state) => state.products.status);
  const prodError = useSelector((state) => state.products.error);

  const dispatch = useDispatch();
  const { productId } = useParams();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setInputValues((values) => ({
      ...values,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleCategoryChange = (value) => {
    setInputValues((values) => ({ ...values, category: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(inputValues).forEach(([key, value]) => {
      if (key === "picture" && !(value instanceof File)) return; // Only append if new file
      if (key === "picture" && value === "") return; // Don't append if empty string
      formData.append(key, value);
    });
    dispatch(updateSingleProduct({ inputValues: formData, productId }))
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          toast.success(response?.message, { autoClose: 1500 });
          navigate("/admin/products");
        } else {
          toast.error(response?.message, { autoClose: 1500 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });
  };

  useEffect(() => {
    dispatch(getSingleProduct(productId));
    dispatch(getAllCategories(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (products && products.product) {
      const { title, price, discount, category, picture, description } = products.product;
      setInputValues({
        title: title || "",
        price: price || "",
        discount: discount || "",
        category: category && category._id ? category._id : "",
        picture: picture && picture.secure_url ? picture.secure_url : "",
        description: description || "",
      });
      setPrevPic(picture && picture.secure_url ? picture.secure_url : "");
    }
  }, [products]);

  if (catStatus === "loading" || prodStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (catError === "failed" || prodError === "failed") {
    return (
      <div className="flex justify-center items-center h-screen">Error...</div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
            magnam.
          </CardDescription>
          <CardContent>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter product title"
                    required
                    name="title"
                    value={inputValues.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      type="text"
                      id="price"
                      placeholder="Enter product price"
                      required
                      name="price"
                      value={inputValues.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      type="number"
                      id="discount"
                      placeholder="Enter discount percentage"
                      name="discount"
                      min={0}
                      max={100}
                      value={inputValues.discount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      type="number"
                      id="stock"
                      placeholder="Enter available stock"
                      name="stock"
                      min={0}
                      value={inputValues.stock || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={inputValues.category || ""}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories &&
                          categories.categories &&
                          categories.categories.map((category) => {
                            return (
                              <SelectItem
                                className="capitalize"
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="picture">Picture</Label>
                    <Input
                      type="file"
                      id="picture"
                      name="picture"
                      onChange={(e) => {
                        handleChange({
                          target: { name: "picture", value: e.target.files[0] },
                        });
                      }}
                    />
                    <span className="text-xs text-gray-500">Leave empty to keep current image.</span>
                  </div>
                  <div className="grid gap-3">
                    <Label>Previous Picture</Label>
                    <img
                      src={prevPic}
                      alt={inputValues.title}
                      height={100}
                      width={100}
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    type="text"
                    id="description"
                    required
                    className="min-h-32"
                    name="description"
                    placeholder="Enter product description"
                    value={inputValues.description}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Button type="submit">Update Product</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}

export default UpdateProduct;
