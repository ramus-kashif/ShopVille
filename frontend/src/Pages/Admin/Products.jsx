import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getAllProducts,
} from "@/store/features/products/productSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import moment from "moment";
import { toast } from "react-toastify";
import formatNumber from 'format-number'

function Products() {
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(getAllProducts()); //get all products function
  }, [dispatch]);

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId))
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          toast.success(response?.message, { autoClose: 2000 });
          dispatch(getAllProducts());
        } else {
          toast.error(response?.message, { autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });
  };

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
            <TableHead>Discount (%)</TableHead>
            <TableHead>Final Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products &&
          Array.isArray(products.products) &&
          products.products.length > 0 ? (
            products.products.map((product, index) => (
              <TableRow key={product._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-contain"
                    src={product.picture?.secure_url}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{formatNumber({prefix: 'Rs. '})(product.price) || 0}</TableCell>
                <TableCell>{product.discount || 0}</TableCell>
                <TableCell>{formatNumber({prefix: 'Rs. '})(product.price - (product.price * (product.discount || 0) / 100))}</TableCell>
                <TableCell>{product.stock ?? 0}</TableCell>
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
                    <DropdownMenuContent className="p-2 rounded-lg shadow-lg min-w-[140px] bg-white dark:bg-gray-900">
                      <DropdownMenuLabel className="text-gray-500 dark:text-gray-400 px-2 pb-1">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="px-2 py-2 rounded-md cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 text-red-600 hover:text-red-800 transition">
                        <button
                          onClick={() => {
                            navigate(`/admin/products/update/${product._id}`);
                          }}
                        >
                          Edit
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-2 py-2 rounded-md cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 transition">
                        <button
                          onClick={() => {
                            handleDelete(product._id);
                          }}
                        >
                          Delete
                        </button>{" "}
                      </DropdownMenuItem>
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
