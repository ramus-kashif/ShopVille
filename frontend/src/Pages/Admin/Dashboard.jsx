import { Button } from "@/components/ui/button";

function Dashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>

      {/* ===================== Updated Code for "You have no product"====================== */}

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-bold">You have no products</h2>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4">Dashboard</Button>
          </div>
        </div>
        {/* <h3 className="text-lg font-medium">You have no products</h3>
          </div>
          <div className="flex flex-col items-center gap-1 text-center"> */}
        {/* <h3 className="text-lg font-medium">You have no products</h3> */}
        {/* <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4">Add Product</Button> */}
      </div>
    </>
  );
}

export default Dashboard;
