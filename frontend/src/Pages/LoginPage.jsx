import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/features/auth/authSlice";

export default function LoginPage() {
  const [inputValues, setInputValues] = useState({});
  // const status = useSelector((state) => state.auth.status);
  const { status } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(inputValues))
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          toast.success(response?.message, { autoClose: 2000 });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error(response?.message, { autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Login</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                name="email"
                value={inputValues.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*******"
                required
                name="password"
                value={inputValues.password || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            {" "}
            <Button
              type="submit"
              className="w-full"
              disabled={status == "loading" ? true : false}
            >
              {status == "loading" ? "Signing in....." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
        <div className=" mb-5 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="underline">
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
}
