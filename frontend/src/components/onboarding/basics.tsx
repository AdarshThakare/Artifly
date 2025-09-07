import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../Card";
import { Input } from "../Input";
import { Select } from "../Select";
import { Button } from "../Button";
import { Palette, Mic, ArrowRight, Sparkles } from "lucide-react";

interface Step1Props {
  direction: "forward" | "backward";
  onNext: () => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export default function Step1Basics({
  direction,
  onNext,
  selectedCategory,
  setSelectedCategory,
}: Step1Props) {
  const [title, setTitle] = useState("");
  const [aiTitles, setAiTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://genai-exchange-llm-api-1.onrender.com/get_titles",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_name: title }),
        }
      );
      const data = await res.json();
      console.log("AI generated title response - ", data);
      if (data && Array.isArray(data.titles)) {
        setAiTitles(data.titles);
      }
    } catch (err) {
      console.error("Error fetching AI titles:", err);
    } finally {
      setLoading(false);
    }
  };

  const isNextDisabled = !selectedTitle;

  return (
    <motion.div
      key="step1"
      custom={direction}
      initial={{ x: direction === "forward" ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? -80 : 80, opacity: 0 }}
      className="absolute w-full"
    >
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-2xl mb-6 flex items-center gap-2">
          <Palette className="h-6 w-6 text-blue-600" /> Product Basics
        </h2>
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <p className="text-xl font-light mb-2">Product Name</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Clay Pot"
              icon={<Mic className="h-5 w-5 text-gray-400" />}
              className="text-lg py-2"
            />
          </div>

          {/* Generate AI Titles */}
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={!title.trim() || loading}
              className="flex items-center gap-2"
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
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Choose Your Title:
                </p>
                <div className="grid gap-3">
                  {[title, ...aiTitles].map((t, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedTitle(t)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full text-left px-4 py-2 rounded-xl border transition ${
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

          {/* Category */}
          <div>
            <p className="text-xl font-light mb-2">Category</p>
            <Select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedCategory(e.target.value)
              }
              options={[
                { value: "pottery", label: "Pottery" },
                { value: "jewelry", label: "Jewelry" },
                { value: "painting", label: "Painting" },
                { value: "other", label: "Other..." },
              ]}
              className="text-lg py-2"
            />
          </div>

          {/* Conditionally show 'Other' input */}
          <AnimatePresence>
            {selectedCategory === "other" && (
              <motion.div
                key="other-input"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg font-light mb-2">Specify Your Category</p>
                <Input
                  placeholder="Enter your category"
                  className="text-lg py-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-8">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={onNext}
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
