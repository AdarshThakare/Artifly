import { useUser } from "@clerk/clerk-react";
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
  Sparkles,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Jarvis from "../components/Jarvis";
import ShareableListings from "../components/ShareableListings";
import { Footer } from "../components/Footer";
import SocialPosts from "../components/SocialPosts";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Mock data for charts
const viewsData = [
  { date: "Mon", views: 45, unique: 38 },
  { date: "Tue", views: 52, unique: 44 },
  { date: "Wed", views: 61, unique: 51 },
  { date: "Thu", views: 58, unique: 49 },
  { date: "Fri", views: 73, unique: 62 },
  { date: "Sat", views: 89, unique: 71 },
  { date: "Sun", views: 95, unique: 78 },
];

const likesData = [
  { date: "Mon", likes: 3 },
  { date: "Tue", likes: 5 },
  { date: "Wed", likes: 4 },
  { date: "Thu", likes: 7 },
  { date: "Fri", likes: 6 },
  { date: "Sat", likes: 8 },
  { date: "Sun", likes: 6 },
];

const ratingDistribution = [
  { rating: "5 Star", count: 15, percentage: 65 },
  { rating: "4 Star", count: 6, percentage: 26 },
  { rating: "3 Star", count: 2, percentage: 9 },
  { rating: "2 Star", count: 0, percentage: 0 },
  { rating: "1 Star", count: 0, percentage: 0 },
];

const storyScoreMetrics = [
  { category: "Authenticity", score: 95 },
  { category: "Engagement", score: 88 },
  { category: "Visual Appeal", score: 92 },
  { category: "Storytelling", score: 90 },
  { category: "SEO Quality", score: 94 },
];

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
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    className={`bg-white rounded-lg shadow ${className} ${
      onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </div>
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

const StatsModal = ({
  isOpen,
  onClose,
  statType,
  statValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  statType: string;
  statValue: number;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  if (!isOpen) return null;

  const generateAIInsight = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `As a social media analytics expert, analyze this ${statType} metric with a value of ${statValue}. Provide:
1. A brief assessment of performance
2. 2-3 specific, actionable recommendations to improve this metric
3. Industry benchmark comparison
4. Predicted trend for next week

Keep the response concise, professional, and actionable. Format it as a brief analysis (3-4 short paragraphs).`,
            },
          ],
        }),
      });

      const data = await response.json();
      const insight =
        data.content.find((item: any) => item.type === "text")?.text ||
        "Unable to generate insight.";
      setAiInsight(insight);
    } catch (error) {
      setAiInsight(
        "Unable to generate AI insights at this time. Please try again later."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const renderModalContent = () => {
    switch (statType) {
      case "views":
        return (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">590</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 12% vs last week
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-green-600">473</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% vs last week</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-purple-600">2.4m</p>
                <p className="text-xs text-gray-600 mt-1">Per session</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Weekly View Trends
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="unique"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="#10B98120"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                  AI-Powered Insights
                </h3>
                {!aiInsight && (
                  <button
                    onClick={generateAIInsight}
                    disabled={isGenerating}
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isGenerating ? "Analyzing..." : "Generate Insights"}
                  </button>
                )}
              </div>
              {aiInsight ? (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {aiInsight}
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  Click "Generate Insights" to get AI-powered recommendations
                </p>
              )}
            </div>
          </>
        );

      case "likes":
        return (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-pink-600">39</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% vs last week</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Like Rate</p>
                <p className="text-2xl font-bold text-blue-600">6.6%</p>
                <p className="text-xs text-gray-600 mt-1">Of total views</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Best Day</p>
                <p className="text-2xl font-bold text-green-600">Sat</p>
                <p className="text-xs text-gray-600 mt-1">8 likes</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Daily Likes Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={likesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-pink-600" />
                  AI-Powered Insights
                </h3>
                {!aiInsight && (
                  <button
                    onClick={generateAIInsight}
                    disabled={isGenerating}
                    className="text-xs bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-pink-700 disabled:opacity-50"
                  >
                    {isGenerating ? "Analyzing..." : "Generate Insights"}
                  </button>
                )}
              </div>
              {aiInsight ? (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {aiInsight}
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  Click "Generate Insights" to get AI-powered recommendations
                </p>
              )}
            </div>
          </>
        );

      case "rating":
        return (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-yellow-600">4.8</p>
                <p className="text-xs text-gray-600 mt-1">Out of 5.0</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-blue-600">23</p>
                <p className="text-xs text-green-600 mt-1">↑ 3 this week</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">5-Star Rate</p>
                <p className="text-2xl font-bold text-green-600">65%</p>
                <p className="text-xs text-gray-600 mt-1">Excellent</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Rating Distribution
              </h3>
              <div className="space-y-3">
                {ratingDistribution.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-sm text-gray-600 w-16">
                      {item.rating}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-600" />
                  AI-Powered Insights
                </h3>
                {!aiInsight && (
                  <button
                    onClick={generateAIInsight}
                    disabled={isGenerating}
                    className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-full hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {isGenerating ? "Analyzing..." : "Generate Insights"}
                  </button>
                )}
              </div>
              {aiInsight ? (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {aiInsight}
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  Click "Generate Insights" to get AI-powered recommendations
                </p>
              )}
            </div>
          </>
        );

      case "story":
        return (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Story Score</p>
                <p className="text-2xl font-bold text-blue-600">92</p>
                <p className="text-xs text-green-600 mt-1">Excellent</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Optimization</p>
                <p className="text-2xl font-bold text-purple-600">AI</p>
                <p className="text-xs text-gray-600 mt-1">Powered</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Improvement</p>
                <p className="text-2xl font-bold text-green-600">+15</p>
                <p className="text-xs text-gray-600 mt-1">This month</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Score Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={storyScoreMetrics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3B82F6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                  AI-Powered Insights
                </h3>
                {!aiInsight && (
                  <button
                    onClick={generateAIInsight}
                    disabled={isGenerating}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isGenerating ? "Analyzing..." : "Generate Insights"}
                  </button>
                )}
              </div>
              {aiInsight ? (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {aiInsight}
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  Click "Generate Insights" to get AI-powered recommendations
                </p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (statType) {
      case "views":
        return "Views Analytics";
      case "likes":
        return "Likes Analytics";
      case "rating":
        return "Rating Analytics";
      case "story":
        return "Story Score Analytics";
      default:
        return "Analytics";
    }
  };

  const getModalIcon = () => {
    switch (statType) {
      case "views":
        return <Eye className="h-6 w-6 text-blue-600" />;
      case "likes":
        return <Heart className="h-6 w-6 text-pink-600" />;
      case "rating":
        return <Star className="h-6 w-6 text-yellow-500" />;
      case "story":
        return <BarChart3 className="h-6 w-6 text-blue-600" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0006] bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg p-2">{getModalIcon()}</div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {getModalTitle()}
                </h2>
                <p className="text-blue-100 text-sm">
                  Detailed metrics and AI insights
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-400 hover:bg-blue-800 hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
};

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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden">
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
                <h2 className="text-xl font-bold text-white">
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<User>(mockUser);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<{
    type: string;
    value: number;
  } | null>(null);

  const [trigger, setTrigger] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();
  const firstName = user?.firstName;

  const handleSaveProfile = (updatedData: Partial<User>) => {
    // Here you would make an API call to save the data
    console.log("Saving profile data:", updatedData);
    setUserData({ ...userData, ...updatedData });
    // Example API call:
    // await axios.put('/api/user/profile', updatedData);
  };

  const handleStatClick = (statType: string, value: number) => {
    setSelectedStat({ type: statType, value });
    setStatsModalOpen(true);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {`${firstName}'s` || "Artisan"} Dashboard
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
            <Card onClick={() => handleStatClick("views", 590)}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Views</p>
                    <p className="text-xl font-bold">590</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                  <span className="text-gray-500 ml-1">from last week</span>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  Click for details →
                </p>
              </CardContent>
            </Card>

            <Card onClick={() => handleStatClick("likes", 39)}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Likes</p>
                    <p className="text-xl font-bold">39</p>
                  </div>
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                  <span className="text-gray-500 ml-1">from last week</span>
                </div>
                <p className="text-xs text-pink-600 mt-3">
                  Click for details →
                </p>
              </CardContent>
            </Card>

            <Card onClick={() => handleStatClick("rating", 4.8)}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Rating</p>
                    <p className="text-xl font-bold">4.8</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Based on 23 reviews
                </p>
                <p className="text-xs text-yellow-600 mt-3">
                  Click for details →
                </p>
              </CardContent>
            </Card>

            <Card onClick={() => handleStatClick("story", 92)}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Story Score</p>
                    <p className="text-xl font-bold">92</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <p className="mt-2 text-sm text-green-600">
                  Excellent{" "}
                  <span className="text-gray-500">AI optimization</span>
                </p>
                <p className="text-xs text-blue-600 mt-3">
                  Click for details →
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Product Upl*/}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Upload className="h-6 w-6 text-blue-600" />
                    Upload New Social Post
                  </span>
                  <Button
                    onClick={() => {
                      navigate("/onboarding");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product Post
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Product Listings */}
          <SocialPosts onEffectRun={() => setTrigger(true)} />
          <ShareableListings trigger={trigger} />
        </div>
      </main>
      <Jarvis />
      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
        onSave={handleSaveProfile}
      />

      {/* Stats Modal */}
      {statsModalOpen && selectedStat && (
        <StatsModal
          isOpen={statsModalOpen}
          onClose={() => {
            setStatsModalOpen(false);
            setSelectedStat(null);
          }}
          statType={selectedStat.type}
          statValue={selectedStat.value}
        />
      )}
    </div>
  );
}
