import React, { useState } from "react";
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
} from "lucide-react";
import { Footer } from "../components/Footer";
import { FileUploader } from "../components/FileUploader";
import { TagChip } from "../components/Tag";

interface Product {
  id: string;
  name: string;
  image: string;
  tags: string[];
  views: number;
  likes: number;
  rating: number;
  status: "active" | "draft";
}

// ✅ Simple reusable Card wrapper
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

// ✅ Reusable Button
function Button({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "text-red-600 hover:bg-red-50 border border-red-200",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  // Mock data
  const products: Product[] = [
    {
      id: "1",
      name: "Handcrafted Ceramic Vase",
      image: "/image.png",
      tags: ["handmade", "ceramic", "home-decor"],
      views: 245,
      likes: 18,
      rating: 4.8,
      status: "active",
    },
    {
      id: "2",
      name: "Woven Basket Set",
      image: "/image.png",
      tags: ["woven", "natural", "storage"],
      views: 189,
      likes: 12,
      rating: 4.6,
      status: "active",
    },
    {
      id: "3",
      name: "Leather Journal Cover",
      image: "/image.png",
      tags: ["leather", "handstitched", "stationery"],
      views: 156,
      likes: 9,
      rating: 4.9,
      status: "draft",
    },
  ];

  const handleUpload = () => {
    if (uploadFiles.length > 0) {
      console.log("Uploading files:", uploadFiles);
      setUploadFiles([]);
      setShowUpload(false);
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
                    onClick={() => setShowUpload(!showUpload)}
                    variant={showUpload ? "outline" : "default"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {showUpload ? "Cancel" : "Add Product"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            {showUpload && (
              <CardContent className="space-y-6">
                <FileUploader onFilesChange={setUploadFiles} maxFiles={5} />
                {uploadFiles.length > 0 && (
                  <div className="flex justify-end">
                    <Button onClick={handleUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload & Generate Story
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Product List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>
                    <CardContent>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.map((tag, index) => (
                          <TagChip key={index} tag={tag} />
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {product.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {product.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {product.rating}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
