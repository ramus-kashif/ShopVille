import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/features/products/productSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import moment from "moment";

function Products() {
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const dispatch = useDispatch(); ///

  // const [products, setProducts] = useState([]);

  useEffect(() => {
    axios;
    dispatch(getAllProducts()); //get all products function
  }, [dispatch]);

  if (status == "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading Products</p>
      </div>
    );
  }
  if (error == "error") {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Error while fetching Products...</p>
      </div>
    );
  }

  // useEffect(() => {
  //   axios
  //     .get(`${import.meta.env.VITE_BASE_URL}/products`)
  //     .then((res) => setProducts(res.data.product || []))
  //     .catch(() => setProducts([]));
  // }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-2xl">Products</h2>
        <Link to={"/admin/products/add"}>
          <Button>Add Product</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr No.</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && Array.isArray(products.product) && products.product.length > 0 ? (
            products.product.map((product, index) => (
              <TableRow key={product._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    src={product.picture?.secure_url}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price || 0}</TableCell>
                <TableCell>{product.category?.name || 0}</TableCell>
                <TableCell>{product.user?.name || 0}</TableCell>
                <TableCell>
                  {moment(product.createdAt).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Products;
