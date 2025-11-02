import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../Button";
import { Card } from "../Card";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Globe,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PreviewPage({
  onPrevious,
  direction,
}: {
  onPrevious: () => void;
  direction: "forward" | "backward";
}) {
  const [selectedCaption, setSelectedCaption] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<
    "instagram" | "facebook"
  >("instagram");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [captions, setCaptions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [seoTags, setSeoTags] = useState<string[]>([]);
  const [imageBase64, setImageBase64] = useState("");
const [loading, setLoading] = useState(false); // ✅ Add at top of component


  const { user } = useUser();

  const navigate = useNavigate();

  const storeData = async (selectedCaption: string) => {
    const postId = localStorage.getItem("postId");

    const data = localStorage.getItem("postContents");
    if (!data) return;
    const parsed = JSON.parse(data);
    console.log("seo : ", parsed?.seo_tags);
    console.log("hashtags : ", parsed?.hashtags);

    try {
      const response = await axios.put(
        // `http://localhost:3000/api/v1/post/${postId}`,
        `https://artifly-backend.onrender.com/api/v1/post/${postId}`,
        {
          seo_tags: parsed?.seo_tags,
          hashtags: parsed?.hashtags,
          caption: selectedCaption,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Caption, seo, hashtags storage success:", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  // Read from localStorage
  const storedPostContents = localStorage.getItem("postContents");
  const storedTitle = localStorage.getItem("userTitle");
  const storedCategory = localStorage.getItem("category");
  const storedLocation = localStorage.getItem("location");
  const storedImage = localStorage.getItem("ImageBase64");
  const storedStory = localStorage.getItem("story"); // ✅ Add this

  console.log("🔍 Loading preview data...");
  console.log("storedPostContents:", storedPostContents);

  if (storedPostContents) {
    try {
      const parsed = JSON.parse(storedPostContents);
      console.log("📦 Parsed postContents:", parsed);
      
      // ✅ Set data with fallbacks
      setCaptions(parsed.captions || []);
      setHashtags(parsed.hashtags || []);
      setSeoTags(parsed.seo_tags || []);
      setDescription(parsed.description || storedStory || ""); // ✅ Use story as fallback
      
      // Set first caption as default if available
      if (parsed?.captions?.length > 0) {
        setSelectedCaption(parsed.captions[0]);
        console.log("✅ Set default caption:", parsed.captions[0]);
      } else {
        console.warn("⚠️ No captions found in postContents");
      }
    } catch (err) {
      console.error("❌ Failed to parse postContents:", err);
    }
  } else {
    console.warn("⚠️ No postContents in localStorage");
  }

  if (storedTitle) setTitle(storedTitle);
  if (storedCategory) setCategory(storedCategory);
  if (storedLocation) setLocation(storedLocation);
  
  // ✅ Validate before setting
  if (storedImage && storedImage.startsWith("data:image/")) {
    setImageBase64(storedImage);
    console.log("✅ Image loaded");
  } else {
    console.warn("⚠️ No valid imageBase64 found in localStorage");
  }
}, []);


  const InstagramPost = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.fullName?.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-semibold text-sm">{user?.fullName}</div>
            <div className="text-xs text-gray-500">{location}</div>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </div>

      {/* Image */}
      {imageBase64 ? (
        <div className="aspect-square overflow-hidden">
          <img
            src={imageBase64}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-square bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm opacity-90">{title}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Heart className="w-6 h-6 text-gray-800" />
            <MessageCircle className="w-6 h-6 text-gray-800" />
            <Send className="w-6 h-6 text-gray-800" />
          </div>
          <Bookmark className="w-6 h-6 text-gray-800" />
        </div>

        <div className="text-sm font-semibold mb-2">1,234 likes</div>

        <div className="text-sm">
          <span className="font-semibold">{user?.fullName}</span>{" "}
          {selectedCaption || "Select a caption to preview here"}
        </div>

        {hashtags.length > 0 && (
          <div className="text-xs text-blue-800 mt-2">{hashtags.join(" ")}</div>
        )}

        <div className="text-xs text-gray-500 mt-2">2 hours ago</div>
        <div className="h-10"></div>
      </div>
    </div>
  );

  const FacebookPost = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.fullName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{user?.fullName}</div>
            <div className="text-xs text-gray-500 flex items-center">
              2h · <Globe className="w-3 h-3 ml-1" />
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </div>

        {/* Post text */}
        <div className="text-sm mb-3">
          {selectedCaption || "Select a caption to preview here"}
        </div>
        {hashtags.length > 0 && (
          <div className="text-xs text-blue-600 mb-3">{hashtags.join(" ")}</div>
        )}
      </div>

      {/* Image */}
      {imageBase64 ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={imageBase64}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-5xl mb-2">📷</div>
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-sm opacity-90">{location}</div>
          </div>
        </div>
      )}

      {/* Stats and Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center">
                <Heart className="w-2 h-2 text-white fill-current" />
              </div>
              <div className="w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center">
                <Heart className="w-2 h-2 text-white fill-current" />
              </div>
            </div>
            <span>142</span>
          </div>
          <div>8 comments · 23 shares</div>
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-around">
            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Comment</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">
              <Send className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      key="preview"
      custom={direction}
      initial={{ x: direction === "forward" ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? -80 : 80, opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 p-6"
    >
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-8">
        Preview Your Post
      </h1>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Post Details & Caption Selection */}
        <div className="space-y-6">
          {/* Post Info */}
          <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Post Details
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Title:
                </span>
                <p className="text-gray-800 dark:text-gray-200 mt-1">{title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Category:
                </span>
                <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {category}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Location:
                </span>
                <p className="text-gray-800 dark:text-gray-200 mt-1">
                  {location}
                </p>
              </div>
              {description && (
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Description:
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Caption Selection */}
          <AnimatePresence>
            {captions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
                    Choose Your Favorite Caption
                  </h3>
                  <div className="space-y-3">
                    {captions.map((cap, idx) => (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.97 }}
                        className={`cursor-pointer p-4 rounded-xl border transition-all ${
                          selectedCaption === cap
                            ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white border-blue-600 shadow-lg"
                            : "bg-white/70 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-500 text-gray-800 dark:text-gray-200"
                        }`}
                        onClick={() => setSelectedCaption(cap)}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                              selectedCaption === cap
                                ? "border-white bg-white"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {selectedCaption === cap && (
                              <div className="w-full h-full rounded-full bg-blue-600 scale-50"></div>
                            )}
                          </div>
                          <p className="text-sm flex-1">{cap}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hashtags and SEO */}
          {(hashtags.length > 0 || seoTags.length > 0) && (
            <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Hashtags & SEO
              </h3>
              <div className="space-y-4">
                {hashtags.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Hashtags:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-blue-600 dark:text-blue-400 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {seoTags.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      SEO Tags:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {seoTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel - Phone Preview */}
        <div className="flex flex-col items-center">
          {/* Platform Selector */}
          <div className="mb-6">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedPlatform("instagram")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedPlatform === "instagram"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                Instagram
              </button>
              <button
                onClick={() => setSelectedPlatform("facebook")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedPlatform === "facebook"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                Facebook
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <motion.div
            className="bg-black rounded-[2.5rem] shadow-2xl border-8 border-gray-900 relative w-[420px] h-[720px] flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-full h-full bg-gray-900 rounded-[2rem] p-1">
              <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-[1.5rem] overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-8 pb-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
                  <span>9:41</span>
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 border border-gray-600 rounded-sm">
                      <div className="w-3/4 h-full bg-gray-600 rounded-sm"></div>
                    </div>
                  </div>
                </div>

                {/* App Content */}
                <div className="px-4 pb-4 h-full overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPlatform}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {selectedPlatform === "instagram" ? (
                        <InstagramPost />
                      ) : (
                        <FacebookPost />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="border-2 mt-3 border-dotted border-gray-400 rounded-lg p-6 text-center">
            <p className="text-gray-600 font-medium">
              Stay Tuned for Automatic Post Scheduling
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        {/* <Button
          onClick={async () => {
            navigate("/dashboard");

            (async () => {
              try {
                await storeData(selectedCaption);
                console.log("Caption stored successfully");
              } catch (err) {
                console.error("Error storing caption:", err);
              }
            })();
          }}
          disabled={!selectedCaption}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600"
        >
          Save Product
        </Button> */}


       <Button
  onClick={async () => {
    console.log("🔍 Button clicked - selectedCaption:", selectedCaption);
    console.log("🔍 Captions array:", captions);
    
    // ✅ Allow proceeding even without captions (use title as fallback)
    const finalCaption = selectedCaption && selectedCaption.trim() !== "" 
      ? selectedCaption 
      : title || "Check out my product!";
    
    console.log("📝 Using caption:", finalCaption);

    try {
      setLoading(true);
      
      // Gather all data from localStorage
      const imageBase64Local = localStorage.getItem("ImageBase64");
      const userTitle = localStorage.getItem("userTitle");
      const category = localStorage.getItem("category");
      const location = localStorage.getItem("location");
      const story = localStorage.getItem("story");

      // ✅ Validate required fields
      if (!imageBase64Local || !userTitle) {
        alert("Missing required data (image or title). Please go back and complete all steps.");
        setLoading(false);
        return;
      }
      
      console.log("📦 Preparing to save product...", {
        userTitle,
        category,
        location,
        hasImage: !!imageBase64Local,
        hasStory: !!story,
        finalCaption
      });

      // Convert base64 to File for FormData
      function base64ToFile(base64String: string, filename: string) {
        const arr = base64String.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }

      // Create FormData with all product data
      const formData = new FormData();
      
      const imageFile = base64ToFile(imageBase64Local, "product.png");
      formData.append("image", imageFile);
      formData.append("name", userTitle);
      if (category) formData.append("category", category);
      if (location) formData.append("location", location);
      if (story) formData.append("description", story);

      // Step 1: Upload complete product to backend
      console.log("🚀 Uploading product to backend...");
      const res = await axios.post(
        `https://artify-backend-dke3.onrender.com/api/products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );
      const product = res.data;
      console.log("✅ Product saved:", product);

      // Store caption, seo, hashtags (optional - won't break if it fails)
      try {
        await storeData(finalCaption);
      } catch (err) {
        console.log("⚠️ Optional storeData failed:", err);
      }

      // Step 2: Trigger n8n webhook for Instagram posting (run in background)
      console.log("📸 Triggering Instagram post via n8n...");
      const instagramCaption = `${userTitle} — ${finalCaption}${hashtags.length > 0 ? '\n\n' + hashtags.join(" ") : ''}`;
      
      // Don't await this - let it run in background
      axios.post(
        `https://artify-backend-dke3.onrender.com/api/trigger-instagram`,
        {
          imageUrl: product.imageUrl,
          caption: instagramCaption,
          productId: product._id,
          name: userTitle,
          location: location || "",
          category: category || "",
        },
        {
          timeout: 10000, // 10 second timeout
        }
      ).then(() => {
        console.log("✅ Instagram post triggered successfully");
      }).catch((err) => {
        console.warn("⚠️ Instagram post trigger failed (non-critical):", err);
      });

      console.log("✅ Product saved successfully!");
      alert("Product saved! Instagram post is being processed in the background. ✅");
      
      // Clear localStorage
      localStorage.removeItem("postId");
      localStorage.removeItem("ImageBase64");
      localStorage.removeItem("userTitle");
      localStorage.removeItem("category");
      localStorage.removeItem("location");
      localStorage.removeItem("story");
      localStorage.removeItem("postContents");
      
      navigate("/dashboard");

    } catch (err: any) {
      console.error("❌ Submission failed:", err);
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Something went wrong!";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
  className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Posting..." : "Save Product"}
</Button>

      </div>
    </motion.div>
  );
}
