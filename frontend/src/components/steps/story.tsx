import { AnimatePresence, motion } from "framer-motion";
import { Card } from "../Card";
import { Button } from "../Button";
import { VoiceRecorder } from "../VoiceRecorder";
import { Tag, ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";

import axios from "axios";

interface Step2Props {
  direction: "forward" | "backward";
  onPrevious: () => void;
  onNext: () => void;
}

export default function Step2Story({
  direction,
  onPrevious,
  onNext,
}: Step2Props) {
  const [transcript, setTranscript] = useState("");
  const [typedText, setTypedText] = useState("");
  const [aiDescriptions, setAiDescriptions] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const location = localStorage.getItem("location");
  const category = localStorage.getItem("category");
  const userTitle = localStorage.getItem("userTitle");
  const image = localStorage.getItem("ImageBase64");

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

  const storeData = async (story: string) => {
    const postId = localStorage.getItem("postId");
    try {
      const response = await axios.post(
        `https://artifly-backend.onrender.com/api/v1/post/store-description/${postId}`,
        {
          story: story,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Story storage success:", response.data);

      console.log("Story storage", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const generateTagsAndCaption = async () => {
    if (!typedText.trim()) {
      alert("Please fill in the description first!");
      return;
    }
    setLoading(true);
    if (!image) {
      console.log("Image not found!");
      return;
    }

    const file = base64ToFile(image, "product.png"); // Convert base64 to File

    console.log("SELECTED", userTitle, location, category);
    try {
      const formData = new FormData();
      if (userTitle && location && category) {
        formData.append("image", file);
        formData.append("title", userTitle);
        formData.append("description", selectedDescription); //should be selected Description
        formData.append("category", category);
        formData.append("location", location);
      }

      const res = await axios.post(
        "https://genai-exchange-llm-api-3.onrender.com/gen-tags-captions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response", res.data);
      if (res.data.success) {
        console.log("Captions, SEO tags and hashtags:", res.data.data);
        localStorage.setItem("postContents", JSON.stringify(res.data.data));
      } else {
        console.error("Backend error:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching AI titles:", err);
    } finally {
      setLoading(false);
    }
  };

  const storeDescription = async () => {
    const postId = localStorage.getItem("postId");
    try {
      const response = await axios.post(
        `https://artifly-backend.onrender.com/api/v1/post/store-description/${postId}`,
        {
          description: typedText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Description storage success:", response.data);

      console.log("Description storage", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGenerate = async () => {
    if (!typedText.trim()) {
      alert("Please fill in the description first!");
      return;
    }
    setLoading(true);

    console.log("SELECTED", userTitle, location, category);
    try {
      // Create FormData and append required fields
      const formData = new FormData();
      if (userTitle && location && category) {
        formData.append("user_title", userTitle);
        formData.append("location", location);
        formData.append("category", category);
        formData.append("description", typedText);
      }

      const res = await axios.post(
        "https://genai-exchange-llm-api-3.onrender.com/gen-stories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response", res.data);
      if (res.data.success) {
        console.log("Generated Titles:", res.data.data.stories);
        setAiDescriptions(res.data.data.stories);
      } else {
        console.error("Backend error:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching AI titles:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="step2"
      custom={direction}
      initial={{ x: direction === "forward" ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? -80 : 80, opacity: 0 }}
      className=" w-full"
    >
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
          <Tag className="h-6 w-6 text-blue-600" /> Share the Cultural History
          of Your Product
        </h2>

        {/* Voice recording option */}
        <VoiceRecorder
          transcript={transcript}
          onTranscriptChange={setTranscript}
        />

        <div className="my-4 text-center text-gray-500">— OR —</div>

        {/* Text input option */}
        <textarea
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          placeholder="Type your story here..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
        />

        {/* Generate AI Descriptions */}
        <div className="flex justify-start mt-6">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={!typedText.trim() || loading}
            className="flex items-center gap-2 bg-background"
          >
            <Sparkles className="h-4 w-4 text-yellow-500" />
            {loading ? "Generating..." : "Generate Catchy Descriptions"}
          </Button>
        </div>

        {/* Title Choices */}
        <AnimatePresence>
          {(aiDescriptions.length > 0 || typedText.trim()) && (
            <motion.div
              key="title-options"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <p className="text-lg mt-6 font-medium text-gray-700 dark:text-gray-300">
                Choose Your Enhanced Story-telling Description:
              </p>
              <div className="grid gap-3">
               // Replace this section in your story.tsx:

{[typedText, ...aiDescriptions].map((t, idx) => (
  <motion.button
    key={idx}
    onClick={async () => {
      setSelectedDescription(t);
      
      // ✅ FIX: Pass the description directly instead of using state
      if (!t.trim()) {
        alert("Please fill in the description first!");
        return;
      }
      setLoading(true);
      
      if (!image) {
        console.log("Image not found!");
        setLoading(false);
        return;
      }

      const file = base64ToFile(image, "product.png");

      console.log("SELECTED", userTitle, location, category);
      console.log("Description being sent:", t); // ✅ Debug log
      
      try {
        const formData = new FormData();
        if (userTitle && location && category) {
          formData.append("image", file);
          formData.append("title", userTitle);
          formData.append("description", t); // ✅ Use 't' directly, not state
          formData.append("category", category);
          formData.append("location", location);
        }

        const res = await axios.post(
          "https://genai-exchange-llm-api-3.onrender.com/gen-tags-captions",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("✅ AI Response:", res.data);
        if (res.data.success) {
          console.log("Captions, SEO tags and hashtags:", res.data.data);
          localStorage.setItem("postContents", JSON.stringify(res.data.data));
          alert("✅ Captions generated successfully!");
        } else {
          console.error("Backend error:", res.data.message);
          alert(`Error: ${res.data.message}`);
        }
      } catch (err: any) {
        console.error("Error fetching AI captions:", err);
        alert(`Failed: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    }}
    whileTap={{ scale: 0.97 }}
    className={`w-full text-left px-4 my-2 hover:border-2! hover:border-sky-500! py-2 rounded-xl border transition ${
      selectedDescription === t
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

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>

          <Button
  onClick={async () => {
    // Get the final story
    const finalStory = selectedDescription || typedText;

    if (!finalStory.trim()) {
      alert("Please select or type a description before proceeding!");
      return;
    }

    // Store in localStorage immediately
    localStorage.setItem("story", finalStory);
    
    try {
      // Store in database
      await storeDescription();
      await storeData(finalStory);
      console.log("✅ Story saved:", finalStory);
      
      // Check if captions were generated
      const postContents = localStorage.getItem("postContents");
      if (!postContents) {
        console.warn("⚠️ No captions generated yet - user will see fallback");
      }
      
      // Navigate to next step
      onNext();
    } catch (err) {
      console.error("❌ Failed to save story:", err);
      alert("Failed to save story. Please try again.");
    }
  }}
  disabled={!selectedDescription && !typedText.trim()}
>
  Next
</Button>
        </div>
      </Card>
    </motion.div>
  );
}
