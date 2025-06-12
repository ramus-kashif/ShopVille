import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GetSingleCategory, updateCategory } from "@/store/features/categories/categoriesSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateCategory() {
  const [catName, setCatName] = useState({});
  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCategory({name: catName, slug}))
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          toast.success(response?.message, { autoClose: 2000 });
          navigate("/admin/categories");
        } else {
          toast.error(response?.message, { autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });

    
  };
  useEffect(() => {
    dispatch(GetSingleCategory(slug))
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          setCatName(response.category?.name);
        } else {
          toast.error(response?.message, { autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });
  }, [dispatch, slug]);
  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Update Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  className="me-2"
                  type="text"
                  required
                  name="name"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                  }}
                />
                <Button>Update Category</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default UpdateCategory;
