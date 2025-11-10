import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Tag,
  MapPin,
  Calendar,
  Loader2,
  Heart,
  Share2,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  CheckCircle,
  X,
  Phone,
  Mail as MailIcon,
  User as UserIcon,
  Plus,
  Minus,
} from "lucide-react";

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
  updatedAt: string;
  pricePerPiece?: number;
  totalCollected?: number;
}

interface PaymentFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  quantity: number;
}

const ShareableProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [formData, setFormData] = useState<PaymentFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    quantity: 1,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      // Replace with your actual API endpoint
      const response = await axios.get(
        `https://artifly-backend.onrender.com/api/v1/post/${id}`
      );

      setProduct(response.data?.product || response.data);
    } catch (err: any) {
      console.error("Error fetching product:", err);
      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalAmount = () => {
    return (product?.pricePerPiece || 1499) * quantity;
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      setFormData({ ...formData, quantity: newQuantity });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setPaymentLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Create order on backend
      const orderResponse = await axios.post(
        "https://artifly-backend.onrender.com/api/v1/payment/create-order",
        {
          amount: getTotalAmount(),
          productId: product?._id,
          quantity: quantity,
          customerDetails: formData,
        }
      );

      const { orderId, amount, currency } = orderResponse.data;

      // Razorpay options
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
        amount: amount,
        currency: currency,
        name: "Artisan Platform",
        description: product?.name || "Product Purchase",
        image: product?.images[0] || "",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              "https://artifly-backend.onrender.com/api/v1/payment/verify",
              {
                orderId: orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                productId: product?._id,
                customerDetails: formData,
              }
            );

            if (verifyResponse.data.success) {
              setPaymentSuccess(true);
              setShowPaymentModal(false);

              // Show success message
              setTimeout(() => {
                alert(
                  "Payment successful! You will receive order details via email."
                );
              }, 500);
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      setPaymentLoading(false);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
      setPaymentLoading(false);
    }
  };

  // Stripe payment alternative
  const initiateStripePayment = async () => {
    setPaymentLoading(true);

    try {
      const response = await axios.post(
        "https://artifly-backend.onrender.com/api/v1/payment/create-stripe-session",
        {
          productId: product?._id,
          quantity: quantity,
          customerDetails: formData,
          amount: getTotalAmount(),
        }
      );

      // Redirect to Stripe checkout
      window.location.href = response.data.sessionUrl;
    } catch (error) {
      console.error("Stripe payment failed:", error);
      alert("Failed to initiate payment. Please try again.");
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 h-fit">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Title and Price */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatCurrency(product.pricePerPiece || 1499)}
                  </span>
                  <span className="text-gray-500 text-sm">per piece</span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-green-500" />
                    {product.location}
                  </span>
                  <span className="flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-blue-500" />
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Caption */}
              {product.caption && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm italic text-gray-700">
                    "{product.caption}"
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Buy Now</span>
              </button>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <Truck className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Authentic</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Product
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {product.story && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Artisan's Story
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.story}
                  </p>
                </>
              )}

              {/* Hashtags */}
              {product.hashtags && product.hashtags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Tags */}
              {product.seo_tags && product.seo_tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.seo_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Complete Your Purchase
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Enter your details to proceed
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={initiatePayment}
              className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-5"
            >
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{product.name}</span>
                    <span className="font-medium">
                      {formatCurrency(product.pricePerPiece || 1499)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">× {quantity}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="font-bold text-blue-600 text-lg">
                      {formatCurrency(getTotalAmount())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="h-4 w-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MailIcon className="h-4 w-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="XXXXXX"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={initiatePayment}
                disabled={paymentLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>
                      Proceed to Payment - {formatCurrency(getTotalAmount())}
                    </span>
                  </>
                )}
              </button>
              <p className="text-xs text-center text-gray-500 mt-3">
                <Shield className="h-3 w-3 inline mr-1" />
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. You will receive order confirmation
              via email shortly.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareableProductPage;
