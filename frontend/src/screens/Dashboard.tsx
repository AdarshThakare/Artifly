import axios from "axios";
import {
  Upload,
  Edit,
  Trash2,
  TrendingUp,
  Eye,
  Heart,
  Star,
  BarChart3,
  Plus,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Tag,
  Loader2,
  User as UserIcon,
  X,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Jarvis from "../components/Jarvis.tsx"
// Mock user data - replace with actual data from your backend
const mockUser = {
  clerkId: "user_123",
  email: "artisan@example.com",
  firstName: "John",
  lastName: "Doe",
  profilePicture: null,
  location: "Mumbai, India",
  category: "Pottery",
  specialization: ["Ceramic Pottery", "Decorative Items"],
  instagramLink: "https://instagram.com/johndoe",
  facebookLink: "https://facebook.com/johndoe",
};

interface Product {
  _id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  title: string;
  story: string;
  caption: string;
  hashtags: string[];
  seo_tags: string[];
  images: string[];
  user: string;
  timestamp: string;
}

interface User {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  location: string;
  category: string;
  specialization: string[];
  instagramLink: string;
  facebookLink: string;
}

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
);

const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
  type?: "button" | "submit";
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors";
  const variantStyles =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      : "bg-blue-600 hover:bg-blue-700 text-white";
  const sizeStyles =
    size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </button>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
      © 2024 Artisan Platform. All rights reserved.
    </div>
  </footer>
);

const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (userData: Partial<User>) => void;
}) => {
  const [formData, setFormData] = useState({
    location: user.location || "",
    category: user.category || "",
    specialization: user.specialization || [],
    instagramLink: user.instagramLink || "",
    facebookLink: user.facebookLink || "",
  });
  const [specializationInput, setSpecializationInput] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addSpecialization = () => {
    if (
      specializationInput.trim() &&
      !formData.specialization.includes(specializationInput.trim())
    ) {
      setFormData({
        ...formData,
        specialization: [
          ...formData.specialization,
          specializationInput.trim(),
        ],
      });
      setSpecializationInput("");
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0008]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome {user.firstName} {user.lastName}!
                </h2>
                <p className="text-blue-100 text-sm mt-1">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:text-red-500 hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-180px)]"
        >
          <div className="p-6 space-y-5">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1 text-green-600" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mumbai, India"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-1 text-blue-600" />
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Pottery, Textiles, Jewelry"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4 inline mr-1 text-yellow-500" />
                Specializations
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addSpecialization())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a specialization"
                />
                <Button type="button" onClick={addSpecialization}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Instagram Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram className="h-4 w-4 inline mr-1 text-pink-600" />
                Instagram Link
              </label>
              <input
                type="url"
                value={formData.instagramLink}
                onChange={(e) =>
                  setFormData({ ...formData, instagramLink: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://instagram.com/username"
              />
            </div>

            {/* Facebook Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="h-4 w-4 inline mr-1 text-blue-700" />
                Facebook Link
              </label>
              <input
                type="url"
                value={formData.facebookLink}
                onChange={(e) =>
                  setFormData({ ...formData, facebookLink: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/username"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<User>(mockUser);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://artifly-backend.onrender.com/api/v1/post/"
        );
        setProducts(response.data.data);
      } catch (err) {
        setProducts([]);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = (updatedData: Partial<User>) => {
    // Here you would make an API call to save the data
    console.log("Saving profile data:", updatedData);
    setUserData({ ...userData, ...updatedData });
    // Example API call:
    // await axios.put('/api/user/profile', updatedData);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (product: Product) => {
    const hasContent =
      product.name || product.description || product.title || product.story;
    const hasImage = product.images[0];

    if (hasContent && hasImage) {
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          Active
        </span>
      );
    } else if (hasContent || hasImage) {
      return (
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
          Draft
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Artisan Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your crafts and track your success
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <UserIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </header>

          {/* Insights Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Views</p>
                    <p className="text-2xl font-bold">590</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                  <span className="text-gray-500 ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Likes</p>
                    <p className="text-2xl font-bold">39</p>
                  </div>
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                  <span className="text-gray-500 ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Rating</p>
                    <p className="text-2xl font-bold">4.8</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Based on 23 reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Story Score</p>
                    <p className="text-2xl font-bold">92</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <p className="mt-2 text-sm text-green-600">
                  Excellent{" "}
                  <span className="text-gray-500">AI optimization</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Product Upload Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Upload New Product
                  </span>
                  <Button
                    onClick={() => {
                      navigate("/onboarding");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Product Listings */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span>Your Products ({products.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <span className="ml-3 text-gray-600 text-sm">
                    Loading products...
                  </span>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No products yet. Add your first product to get started!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
                    >
                      {/* Product Image */}
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        {product.images.length > 0 ? (
                          <img
                            src={`${product.images[0]}`}
                            alt={product.name || "Product"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-16 w-16 text-gray-300" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          {getStatusBadge(product)}
                        </div>

                        {/* Action Buttons Overlay */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-white/50 hover:border-white shadow-sm"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-red-50 border-white/50 hover:border-red-200 shadow-sm text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                            {product.name ||
                              product.title ||
                              "Untitled Product"}
                          </h3>

                          {product.caption && (
                            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                              {product.caption}
                            </p>
                          )}
                        </div>

                        {/* Category and Location */}
                        <div className="space-y-1 mb-3">
                          {product.category && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Tag className="h-3 w-3 mr-1 text-blue-500" />
                              {product.category}
                            </div>
                          )}
                          {product.location && (
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1 text-green-500" />
                              {product.location}
                            </div>
                          )}
                        </div>

                        {/* Hashtags */}
                        {product.hashtags && product.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.hashtags
                              .slice(0, 2)
                              .map((hashtag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
                                >
                                  #{hashtag}
                                </span>
                              ))}
                            {product.hashtags.length > 2 && (
                              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                                +{product.hashtags.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Stats and Date */}
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />0
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />0
                            </span>
                          </div>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(product.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      {/* <Jarvis />     */}
      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
