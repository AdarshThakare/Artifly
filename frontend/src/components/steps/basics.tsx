import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../Card";
import { Input } from "../Input";
import { Select } from "../Select";
import { Button } from "../Button";
import {
  Palette,
  Mic,
  ArrowRight,
  Sparkles,
  MapPin,
  Loader2,
  Volume2,
} from "lucide-react"; // ✅ added Volume2 icon for TTS
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

interface Step1Props {
  direction: "forward" | "backward";
  onNext: () => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  aiName: string;
  aiCategory: string;
}

export default function Step1Basics({
  direction,
  onNext,
  selectedCategory,
  setSelectedCategory,
  aiName,
  aiCategory,
}: Step1Props) {
  const [title, setTitle] = useState("");
  const [aiTitles, setAiTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const { user } = useUser();
  const clerkId = user?.id;

  if (clerkId) localStorage.setItem("clerkId", clerkId);
  const clerk_id = localStorage.getItem("clerkId");

  // ✅ Text-to-Speech helper
  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN"; // Indian English accent
    utterance.rate = 1;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel(); // stop ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  // Function to get user's location using GPS
  const getUserLocation = async () => {
    setLocationLoading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (response.ok) {
            const data = await response.json();
            const formattedLocation = `${data.city || data.locality || ""}, ${
              data.principalSubdivision || ""
            }, ${data.countryName || ""}`.replace(/^,\s*|,\s*$/g, "");
            setLocation(
              formattedLocation ||
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            );
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error("Error getting location details:", error);
          setLocationError("Failed to get location details");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Failed to get location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 6000000,
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    console.log("SELECTED", title, location, selectedCategory);
    localStorage.setItem("location", location);
    localStorage.setItem("category", selectedCategory);

    try {
      const formData = new FormData();
      formData.append("user_title", title);
      formData.append("location", location);
      formData.append("category", selectedCategory);

      const res = await axios.post(
        "https://genai-exchange-llm-api-3.onrender.com/gen-titles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response", res.data);
      if (res.data.success) {
        console.log("Generated Titles:", res.data.data.titles);
        setAiTitles(res.data.data.titles);
      } else {
        console.error("Backend error:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching AI titles:", err);
    } finally {
      setLoading(false);
    }
  };

  const isNextDisabled = !selectedTitle || !location.trim();

  async function uploadBase64ToCloudinary(base64String: string) {
    const formData = new FormData();
    formData.append("file", base64String);
    formData.append("upload_preset", "au2ty08i");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dyjl9bwpv/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    return data.secure_url;
  }

  const storeSelectedImage = async (image: string) => {
    try {
      const imageUrl = await uploadBase64ToCloudinary(image);
      const postId = localStorage.getItem("postId");
      await fetch("http://localhost:3000/api/v1/post/store-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: postId, imageUrl }),
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const storePrimitives = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/post/",
        {
          clerkId: clerkId,
          name: selectedTitle,
          category: selectedCategory,
          location: location,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("✅ Primitive storage success:", response.data.data);
      localStorage.setItem("postId", response.data.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  const storeData = async (title: string) => {
    try {
      const postId = localStorage.getItem("postId");
      const response = await axios.post(
        `http://localhost:3000/api/v1/post/store-title/${postId}`,
        { title: title },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Title storage success:", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      key="step1"
      custom={direction}
      initial={{ x: direction === "forward" ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? -80 : 80, opacity: 0 }}
      className="w-full"
    >
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-3xl mb-6 flex items-center gap-2 font-outfit! tracking-wide">
          <Palette className="h-6 w-6 text-blue-600" /> Product Basic
          Information
        </h2>

        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl text-gray-600 font-semibold mb-2">
                Product Name
              </p>
              <button
                onClick={() => speak("Krupayaa aapkay sahitya ka naam daalie.")}
              >
                <Volume2 className="h-5 w-5 mb-3 text-gray-500 hover:text-blue-600 transition" />
              </button>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Clay Pot"
              icon={<Mic className="h-5 w-5 text-gray-400" />}
              className="text-lg py-2"
            />
            <div className="flex items-center gap-2 my-2">
              <p className="text-xl font-light text-cyan-700">
                AI suggestion - {aiName}
              </p>
              <button onClick={() => speak(`A.I. ka soojhaw    ${aiName}`)}>
                <Volume2 className="h-5 w-5 text-gray-500 hover:text-blue-600 transition" />
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold mb-2">Category</p>
              <button
                onClick={() =>
                  speak("Krupayaa aapkay sahitya ka prkaar daalie..")
                }
              >
                <Volume2 className="h-5 w-5 mb-3 text-gray-500 hover:text-blue-600 transition" />
              </button>
            </div>
            <Select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedCategory(e.target.value)
              }
              options={[
                { value: "textile", label: "Textile" },
                { value: "pottery", label: "Pottery" },
                { value: "furniture", label: "Furniture" },
                { value: "jewellery", label: "Jewellery" },
                { value: "decorative work", label: "Decorative Work" },
                { value: "home utilities", label: "Home Utilities" },
              ]}
              className="text-lg py-2"
            />
            <div className="flex items-center gap-2 my-2">
              <p className="text-xl font-light text-cyan-700">
                AI suggestion -{" "}
                {aiCategory.charAt(0).toUpperCase() + aiCategory.slice(1)}
              </p>
              <button onClick={() => speak(`A.I. ka soojhaw   ${aiCategory}`)}>
                <Volume2 className="h-5 w-5 text-gray-500 hover:text-blue-600 transition" />
              </button>
            </div>
          </div>

          {/* Location Field */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl text-gray-600 font-semibold mb-2">
                Location
              </p>
              <button onClick={() => speak("Krupaya aapka loocation daalie.")}>
                <Volume2 className="h-5 w-5 mb-3 text-gray-500 hover:text-blue-600 transition" />
              </button>
            </div>
            <div className="relative">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                icon={
                  locationLoading ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    <MapPin className="h-5 w-5 text-gray-400" />
                  )
                }
                className="text-lg py-2"
                disabled={locationLoading}
              />
              {!locationLoading && (
                <button
                  onClick={getUserLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Get current location"
                >
                  <MapPin className="h-4 w-4" />
                </button>
              )}
            </div>
            {locationError && (
              <p className="text-sm text-red-500 mt-1">{locationError}</p>
            )}
            {locationLoading && (
              <p className="text-sm text-gray-500 mt-1">
                Getting your location...
              </p>
            )}
          </div>
        </div>

        {/* Generate AI Titles */}
        <div className="flex justify-start mt-6">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={!title.trim() || loading}
            className="flex items-center gap-2 bg-background"
          >
            <Sparkles className="h-4 w-4 text-yellow-500" />
            {loading ? "Generating..." : "Generate Catchy Titles"}
          </Button>
        </div>

        {/* Title Choices */}
        <AnimatePresence>
          {(aiTitles.length > 0 || title.trim()) && (
            <motion.div
              key="title-options"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <p className="text-lg mt-6 font-medium text-gray-700 dark:text-gray-300">
                  Choose Your Title:
                </p>
                <button
                  onClick={() =>
                    speak("Upnney pasand ke title ka chunaav karein.")
                  }
                >
                  <Volume2 className="h-5 w-5 mt-4 text-gray-500 hover:text-blue-600 transition" />
                </button>
              </div>
              <div className="grid gap-3">
                {[title, ...aiTitles].map((t, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setSelectedTitle(t);
                      speak(t);
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full md:grid md:grid-cols-2 text-left px-4 py-2 rounded-xl hover:border-2 hover:border-sky-500 border transition ${
                      selectedTitle === t
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white border-blue-600 shadow"
                        : "bg-white/70 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-500"
                    }`}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-8">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={async () => {
                onNext();
                localStorage.setItem("userTitle", selectedTitle);
                (async () => {
                  try {
                    const image = localStorage.getItem("ImageBase64");
                    await storePrimitives();
                    await storeData(selectedTitle);
                    if (image) await storeSelectedImage(image);
                  } catch (err) {
                    console.error("Background save failed:", err);
                  }
                })();
              }}
              disabled={isNextDisabled}
              className={`flex items-center gap-2 ${
                isNextDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
              }`}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
