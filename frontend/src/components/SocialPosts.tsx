import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  Calendar,
  Edit,
  Eye,
  Heart,
  ImageIcon,
  Loader2,
  MapPin,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./Button";

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
  pricePerPiece: number;
  totalCollected: number;
  itemsSold: string;
  likes: number;
  views: number;
  available: boolean;
  updatedAt: string;
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
  <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
);

const SocialPosts = ({ onEffectRun }: { onEffectRun: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // 🟦 Global states
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // 🟦 Edit Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditPost, setCurrentEditPost] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // 🟦 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clerkId = user?.id;
        setLoading(true);
        const response = await axios.get(
          `https://artifly-backend.onrender.com/api/v1/post/${clerkId}`
        );
        const posts = response.data?.posts || [];
        setProducts(posts);

        const initialPrices: Record<string, number> = {};
        posts.forEach((p: Product) => {
          initialPrices[p._id] = p.pricePerPiece || 0;
        });
        setPrices(initialPrices);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    onEffectRun();
  }, [user]);

  const getStatusBadge = (product: Product) => {
    const hasContent =
      product.name || product.description || product.title || product.story;
    const hasImage = product.images[0];
    if (hasContent && hasImage)
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          Active
        </span>
      );
    else if (hasContent || hasImage)
      return (
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          In Progress
        </span>
      );
    else
      return (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
          Draft
        </span>
      );
  };

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // 🟩 Price Edit
  const handleDoubleClick = (productId: string) => {
    setEditingPriceId(productId);
    setTempPrice(prices[productId] ?? 0);
  };

  const handleSetPrice = async (productId: string) => {
    try {
      setPrices((prev) => ({
        ...prev,
        [productId]: tempPrice,
      }));
      setEditingPriceId(null);

      // Persist to backend
      await axios.patch(
        `https://artifly-backend.onrender.com/api/v1/post/${productId}`,
        {
          pricePerPiece: tempPrice,
        }
      );
    } catch (err) {
      console.error("Failed to update price:", err);
    }
  };

  // 🟦 Edit Modal Handlers
  const openEditModal = (product: Product) => {
    setCurrentEditPost(product);
    setEditForm(product);
    setIsModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (currentEditPost: Product) => {
    if (!currentEditPost) return;
    try {
      const response = await axios.patch(
        `https://artifly-backend.onrender.com/api/v1/post/${currentEditPost._id}`,
        editForm
      );

      const updatedPost = response.data.post;
      console.log(updatedPost);
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
      setIsModalOpen(false);
      setCurrentEditPost(null);
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(
        `https://artifly-backend.onrender.com/api/v1/post/${postId}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // 🟧 Render
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {products ? (
            <span>Your Social Posts ({products.length})</span>
          ) : (
            <span>Your Social Posts : 0</span>
          )}
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
              No social posts yet. Add your first Post to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
              >
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

                  <div className="absolute top-3 left-3">
                    {getStatusBadge(product)}
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    <Button
                      onClick={() => openEditModal(product)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0! bg-white/90 hover:bg-white border-white/50 shadow-sm"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeletePost(product._id)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0! bg-white/90 hover:bg-red-50 border-white/50 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-md mb-1">
                    {product.name || "Untitled Product"}
                  </h3>
                  {product.caption && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.caption}
                    </p>
                  )}

                  <div className="space-y-1 mb-3 mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="h-3 w-3 mr-1 text-blue-500" />
                      {product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1 text-green-500" />
                      {product.location}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 text-xs text-gray-400 pt-2 border-t border-gray-50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {product.views || 0}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {product.likes || 0}
                        </span>
                      </div>
                      <span className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(product.updatedAt)}
                      </span>
                    </div>

                    {/* Editable Price */}
                    <div
                      onDoubleClick={() => handleDoubleClick(product._id)}
                      className="flex items-center justify-between text-gray-700 border-t-2 pt-3"
                    >
                      {editingPriceId === product._id ? (
                        <div className="flex items-center space-x-2 w-full">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) =>
                              setTempPrice(Number(e.target.value))
                            }
                            className="w-full text-xl border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <Button
                            onClick={() => handleSetPrice(product._id)}
                            size="md"
                            className="text-lg bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Set
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xl font-medium">
                          Price: ₹{prices[product._id] ?? 0}
                          <span className="ml-2 text-gray-400 text-xs">
                            (double-click to edit)
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* 🟩 Edit Modal */}
      {isModalOpen && currentEditPost && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl relative shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Edit Post: {currentEditPost.name}
            </h2>

            <div className="space-y-3">
              <div>
                <h2 className="text-md text-yellow-600 font-outfit! tracking-wider">
                  Name -{" "}
                </h2>
                <input
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <h2 className="text-md text-yellow-600 font-outfit! tracking-wider">
                  Location -{" "}
                </h2>
                <input
                  name="location"
                  value={editForm.location || ""}
                  onChange={handleEditChange}
                  placeholder="Location"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <h2 className="text-md text-yellow-600 font-outfit! tracking-wider">
                  Description -{" "}
                </h2>
                <textarea
                  name="description"
                  value={editForm.story || ""}
                  onChange={handleEditChange}
                  placeholder="Description"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <h2 className="text-md text-yellow-600 font-outfit! tracking-wider">
                  Caption -{" "}
                </h2>
                <textarea
                  name="caption"
                  value={editForm.caption || ""}
                  onChange={handleEditChange}
                  placeholder="Caption"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <h2 className="text-md text-yellow-600 font-outfit! tracking-wider">
                  Price per piece (INR)-{" "}
                </h2>
                <input
                  name="pricePerPiece"
                  type="number"
                  value={editForm.pricePerPiece || 0}
                  onChange={handleEditChange}
                  placeholder="Price per piece"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-3">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSaveEdit(currentEditPost)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SocialPosts;
