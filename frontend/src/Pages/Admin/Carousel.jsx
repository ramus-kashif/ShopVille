import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

function Carousel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    image: null,
  });

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/carousel/admin/images", {
        credentials: "include",
      });
      const data = await response.json();
      
      if (data.success) {
        setImages(data.images || []);
      } else {
        toast.error("Failed to fetch carousel images");
      }
    } catch (error) {
      toast.error("Error fetching carousel images");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || (!formData.image && !editingImage)) {
      toast.error("Title and image are required");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("order", formData.order);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const url = editingImage 
        ? `http://localhost:8080/api/v1/carousel/admin/images/${editingImage._id}`
        : "http://localhost:8080/api/v1/carousel/admin/images";
      
      const method = editingImage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingImage ? "Image updated successfully" : "Image added successfully");
        resetForm();
        fetchCarouselImages();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Error saving image");
      console.error("Error:", error);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      order: image.order || 0,
      image: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/carousel/admin/images/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Image deleted successfully");
        fetchCarouselImages();
      } else {
        toast.error(data.message || "Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
      console.error("Error:", error);
    }
  };

  const toggleActive = async (imageId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/carousel/admin/images/${imageId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Image ${!currentStatus ? "activated" : "deactivated"} successfully`);
        fetchCarouselImages();
      } else {
        toast.error(data.message || "Failed to update image");
      }
    } catch (error) {
      toast.error("Error updating image");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      order: 0,
      image: null,
    });
    setEditingImage(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading carousel images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carousel Management</h1>
          <p className="text-gray-600 mt-1">Manage the images displayed in the main carousel</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingImage ? "Edit Carousel Image" : "Add New Carousel Image"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter image title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter image description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="image">
                  {editingImage ? "New Image (optional)" : "Image *"}
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  required={!editingImage}
                />
                {editingImage && (
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to keep the current image
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {editingImage ? "Update Image" : "Add Image"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image._id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toggleActive(image._id, image.isActive)}
                  className={`${image.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  {image.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
              {image.description && (
                <p className="text-sm text-gray-600 mb-2">{image.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>Order: {image.order}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  image.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {image.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(image)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(image._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {images.length === 0 && !showForm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Carousel Images</h3>
          <p className="text-gray-600 mb-4">Add your first carousel image to get started</p>
          <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Add First Image
          </Button>
        </div>
      )}
    </div>
  );
}

export default Carousel; 