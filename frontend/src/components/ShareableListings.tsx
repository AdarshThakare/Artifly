import React, { useEffect, useState } from "react";
import {
  Share2,
  Mail,
  QrCode,
  X,
  ShoppingCart,
  Tag,
  MapPin,
  Eye,
  Heart,
  Star,
  Calendar,
  Copy,
  Check,
  ChevronRight,
  Link,
  Link2,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

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
  updatedAt: string;
  totalCollected: number;
  itemsSold: number;
}

// // Mock product data for demonstration
// const mockProducts = [
//   {
//     _id: "1",
//     name: "Handcrafted Ceramic Vase",
//     category: "Pottery",
//     location: "Mumbai, India",
//     description:
//       "A beautiful handcrafted ceramic vase with intricate patterns inspired by traditional Indian motifs. Each piece is unique and made with love.",
//     title: "Artisan Ceramic Vase",
//     story:
//       "This vase represents 3 generations of pottery craftsmanship passed down in my family.",
//     caption: "Bringing traditional art to modern homes",
//     hashtags: ["handmade", "pottery", "homedecor"],
//     seo_tags: ["ceramic", "vase", "handcrafted", "indian"],
//     images: [
//       "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
//     ],
//     pricePerPiece: 1499,
//     totalCollected: 14990,
//     updatedAt: "2024-01-15T10:30:00Z",
//   },
//   {
//     _id: "2",
//     name: "Silk Embroidered Scarf",
//     category: "Textiles",
//     location: "Varanasi, India",
//     description:
//       "Pure silk scarf with hand embroidery. Features delicate floral patterns that take 40+ hours to complete.",
//     title: "Luxury Silk Scarf",
//     story: "Each stitch tells a story of dedication and artistic passion.",
//     caption: "Wearable art for the modern woman",
//     hashtags: ["silk", "embroidery", "fashion"],
//     seo_tags: ["scarf", "silk", "handembroidered"],
//     images: [
//       "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
//     ],
//     pricePerPiece: 2999,
//     totalCollected: 29990,
//     updatedAt: "2024-01-10T14:20:00Z",
//   },
//   {
//     _id: "3",
//     name: "Terracotta Wall Art",
//     category: "Pottery",
//     location: "Jaipur, India",
//     description:
//       "Traditional terracotta wall hanging with painted details. Perfect for adding rustic charm to any space.",
//     title: "Terracotta Masterpiece",
//     story: "Inspired by the rich heritage of Rajasthani art forms.",
//     caption: "Transform your walls with tradition",
//     hashtags: ["terracotta", "wallart", "homedecor"],
//     seo_tags: ["wall hanging", "terracotta", "indian art"],
//     images: [
//       "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
//     ],
//     pricePerPiece: 899,
//     totalCollected: 7192,
//     updatedAt: "2024-01-05T09:15:00Z",
//   },
// ];

const ShareableListings = ({ trigger }: { trigger: boolean }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrProduct, setQrProduct] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const fetchData = async () => {
    try {
      const clerkId = user?.id;
      setLoading(true);
      const response = await axios.get(
        `https://artifly-backend.onrender.com/api/v1/post/${clerkId}`
      );
      setProducts(response.data?.posts);
    } catch (err) {
      setProducts([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [trigger]);

  const generateShareableLink = (productId: any) => {
    return `https://artifly-seven.vercel.app/product/${productId}`;
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = (product: any) => {
    const subject = encodeURIComponent(`Check out: ${product.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nI wanted to share this beautiful handcrafted item with you:\n\n${
        product.name
      }\n${product.description}\n\nView it here: ${generateShareableLink(
        product._id
      )}\n\nBest regards`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const generateQRCode = (product: any) => {
    setQrProduct(product);
    setShowQRModal(true);
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-10 space-y-6">
      {/* Shareable Listings Section */}
      <div
        className="bg-white rounded-lg shadow"
        onClick={() => {
          fetchData;
        }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Share2 className="h-6 w-6 mr-2 text-blue-600 mb-1" />
            Shareable Product Listings
          </h2>
          <p className="text-md text-gray-500 mt-1">
            Share your products with customers via link, QR code, or email
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-md font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <span className="flex text-sm text-gray-500 items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {product.category}
                      </span>
                      <div className="flex justify-start space-x-3 md:hidden ">
                        <span className="flex items-center text-md tracking-wider md:hidden ">
                          {formatCurrency(product.pricePerPiece)}
                        </span>
                        <span className="flex items-center text-md tracking-wider md:hidden">
                          x{" "}
                        </span>
                        <span className="flex items-center text-md tracking-wider  md:hidden">
                          {product.itemsSold}{" "}
                        </span>
                        <span className="flex items-center text-md tracking-wider  md:hidden ">
                          ={" "}
                        </span>
                        <span className="font-medium text-green-600 text-md  tracking-wider  md:hidden">
                          {formatCurrency(product.totalCollected)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-1 xl:-space-x-20 justify-evenly ">
                  <span className="flex items-center text-lg tracking-wider ">
                    {formatCurrency(product.pricePerPiece)}
                  </span>
                  <span className="flex items-center text-lg tracking-wider ">
                    x{" "}
                  </span>
                  <span className="flex items-center text-lg tracking-wider">
                    {0}{" "}
                  </span>
                  <span className="flex items-center text-lg tracking-wider ">
                    ={" "}
                  </span>
                  <span className="font-medium text-green-600 text-lg tracking-wider">
                    {formatCurrency(0)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(generateShareableLink(product._id));
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Generate Shareable link"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Link2 className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateQRCode(product);
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Generate QR Code"
                  >
                    <QrCode className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      shareViaEmail(product);
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Share via email"
                  >
                    <Mail className="h-5 w-5" />
                  </button>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0005] bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full h-auto  object-contain rounded-lg shadow-md"
                  />
                </div>

                {/* Details Section */}
                <div className="p-8 overflow-y-auto max-h-[90vh]">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                        {selectedProduct.name}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-green-500" />
                        {selectedProduct.location}
                      </span>
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-blue-500" />
                        {selectedProduct.category}
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  {selectedProduct.caption && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm italic text-gray-700">
                        "{selectedProduct.caption}"
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Story */}
                  {selectedProduct.story && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                        Artisan's Story
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.story}
                      </p>
                    </div>
                  )}

                  {/* Hashtags */}
                  {selectedProduct.hashtags &&
                    selectedProduct.hashtags.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.hashtags.map(
                            (tag: any, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* SEO Tags */}
                  {selectedProduct.seo_tags &&
                    selectedProduct.seo_tags.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                          Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.seo_tags.map(
                            (tag: any, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Stats */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Price per piece
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(selectedProduct.pricePerPiece)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Last Updated
                        </p>
                        <p className="text-md text-gray-700 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 mb-1" />
                          {formatDate(selectedProduct.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Purchase Now</span>
                  </button>

                  {/* Share Options */}
                  <div className="mt-4 flex items-center justify-center space-x-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          generateShareableLink(selectedProduct._id)
                        )
                      }
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => generateQRCode(selectedProduct)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>QR Code</span>
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => shareViaEmail(selectedProduct)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0006] bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <QrCode className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                QR Code for {qrProduct.name}
              </h3>
              <p className="text-sm text-gray-500">
                Scan to view product details
              </p>
            </div>

            {/* QR Code Placeholder - You'd integrate a real QR code library here */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
              <div className="bg-gray-100 h-64 flex items-center justify-center rounded">
                <div className="text-center">
                  <QrCode className="h-32 w-32 text-gray-300 mx-auto mb-4" />
                  <p className="text-xs text-gray-500">
                    QR Code would appear here
                    <br />
                    Use a library like 'qrcode.react' or 'qr-code-styling'
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  copyToClipboard(generateShareableLink(qrProduct._id))
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors">
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareableListings;
