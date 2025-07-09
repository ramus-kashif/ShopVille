import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { login } from "@/store/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user = useSelector((state) => state.auth.user?.user);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    picture: user?.picture || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input for picture (upload to Cloudinary)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("picture", file);
      
      const res = await fetch("http://localhost:8080/api/v1/users/upload-profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, picture: data.picture }));
        toast.success("Profile picture uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload picture");
      }
    } catch (err) {
      toast.error("Error uploading picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          picture: form.picture,
          password: form.password || undefined,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        // Update Redux and localStorage with new user info
        const updatedUser = { ...user, ...form, password: undefined };
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch(login.fulfilled({ user: updatedUser }));
        // Navigate to shop page after successful update
        setTimeout(() => {
          navigate("/shop");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-4">
          {form.picture ? (
            <img src={form.picture} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-3xl text-gray-400">?</div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="text-sm" 
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700 transition"
          disabled={loading || uploading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default Profile;