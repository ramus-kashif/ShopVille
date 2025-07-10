import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Phone number formatting utility
const formatPhoneNumber = (value) => {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  if (phoneNumber.length > 10) {
    return phoneNumber.slice(0, 10);
  }
  
  // Add hyphen after 3 digits
  if (phoneNumber.length >= 3) {
    return phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3);
  }
  
  return phoneNumber;
};

function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getAllUsers = () => {
    axios
      .get(`http://localhost:8080/api/v1/users/all-users`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setUsers(response?.data?.users || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllUsers();
    // Get current logged-in user id from localStorage (if stored in user object)
    const user = JSON.parse(window.localStorage.getItem("user"));
    setCurrentUserId(user?.user?._id || user?._id || null);
  }, []);

  const handleEditClick = (user) => {
    const isSelf = currentUserId === user._id;
    if (isSelf) {
      toast.error("You cannot edit your own role while logged in as admin!");
      return;
    }
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      phone: user.phone ? formatPhoneNumber(user.phone.replace(/\D/g, '')) : "", 
      role: user.role 
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Format phone number with automatic hyphen
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteUser = async (userId) => {
    const isSelf = currentUserId === userId;
    if (isSelf) {
      toast.error("You cannot delete your own account while logged in as admin!");
      return;
    }
    // Show confirmation using toast with callback
    toast.info(
      <span>
        Are you sure you want to delete this user?
        <Button
          size="sm"
          className="ml-2"
          onClick={async () => {
            toast.dismiss();
            try {
              await axios.delete(`http://localhost:8080/api/v1/users/${userId}`, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              });
              toast.success("User deleted successfully");
              getAllUsers();
            } catch (error) {
              toast.error(error?.response?.data?.message || "Failed to delete user");
            }
          }}
        >
          Yes
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="ml-2"
          onClick={() => toast.dismiss()}
        >
          No
        </Button>
      </span>,
      { autoClose: false }
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/v1/users/${editingUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("User updated successfully");
      setShowModal(false);
      setEditingUser(null);
      getAllUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6 flex-col md:flex-row md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Button
          className="w-full md:w-auto"
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", email: "", password: "", phone: "", role: 0 });
            setShowModal(true);
          }}
        >
          + Add User
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <section className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {user.phone ? `+92 ${user.phone}` : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === 1 ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                        <Button
                          variant="secondary"
                          className="w-full md:w-auto"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full md:w-auto"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-2">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (editingUser) {
                    // Prevent editing own role
                    const isSelf = currentUserId === editingUser._id;
                    if (isSelf && formData.role !== 1) {
                      toast.error("You cannot change your own role while logged in as admin!");
                      return;
                    }
                    // Call handleFormSubmit which handles its own toasts
                    await handleFormSubmit(e);
                  } else {
                    // Add user logic
                    if (
                      !formData.name ||
                      !formData.email ||
                      !formData.password
                    ) {
                      toast.error("All fields are required");
                      return;
                    }
                    await axios.post(
                      `http://localhost:8080/api/v1/users/register`,
                      formData,
                      {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                      }
                    );
                    setShowModal(false);
                    getAllUsers();
                    toast.success("User added successfully");
                  }
                } catch (error) {
                  toast.error(
                    error?.response?.data?.message || "Failed to save user"
                  );
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <div className="flex">
                  <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0 rounded-l-md text-sm font-medium text-gray-700">
                    +92
                  </div>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full border rounded-r-md px-3 py-2"
                    placeholder="3XX-XXXXXXX"
                    maxLength={11}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: 3XX-XXXXXXX (10 digits)</p>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value={1}>Admin</option>
                  <option value={0}>User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
