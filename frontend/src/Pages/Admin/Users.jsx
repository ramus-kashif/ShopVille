import axios from "axios";
import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState({});
  const getAllUsers = () => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/all-users`, {
        withCredentials: true, // axios send automatically cookies when we apply this property
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setUsers(response?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
      </div>

      {/* ===================== Updated Code for "You have no product"====================== */}

      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x--chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          {JSON.stringify(users, undefined, 4)}
        </div>
      </div>
    </>
  );
}

export default Users;

{
  /* <h3 className="text-lg font-medium">You have no products</h3>
  </div>
  <div className="flex flex-col items-center gap-1 text-center"> */
}
{
  /* <h3 className="text-lg font-medium">You have no products</h3> */
}
{
  /* <p className="text-sm text-muted-foreground">
      You can start selling as soon as you add a product.
    </p>
    <Button className="mt-4">Add Product</Button> */
}
