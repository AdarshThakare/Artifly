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
} from "lucide-react";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

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
  image_base64: string;
  timestamp: string;
}

export const createProduct = async () => {
  try {
    const response = await axios.post(
      "https://genai-exchange-llm-api-3.onrender.com/create_product"
    );
    localStorage.setItem("productId", response.data.product_id);
  } catch (err) {
    console.log(err);
  }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://genai-exchange-llm-api-3.onrender.com/products",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ Array of products:", response.data.products);
        setProducts(response.data.products);
        console.log("Description storage", response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

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
    const hasImage = product.image_base64;

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
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Artisan Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your crafts and track your success
            </p>
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
                      createProduct();
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    createProduct();
                    navigate("/onboarding");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Product
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by uploading your first craft!
                  </p>
                  <Button
                    onClick={() => {
                      createProduct();
                      navigate("/onboarding");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Your First Product
                  </Button>
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
                        {product.image_base64 ? (
                          <img
                            src={`data:image/jpeg;base64,${product.image_base64}`}
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
                            onClick={() =>
                              navigate(`/edit-product/${product._id}`)
                            }
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

      <Footer />
    </div>
  );
}
