import { motion } from "framer-motion";
import { Card } from "../Card";
import { Button } from "../Button";
import { FileUploader } from "../FileUploader";
import {
  ImageIcon,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface Step3Props {
  direction: "forward" | "backward";
  onPrevious: () => void;
  onNext: () => void;
  setAiCategory: React.Dispatch<React.SetStateAction<string>>;
  setAiName: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step3Upload({
  direction,
  onPrevious,
  onNext,
  setAiCategory,
  setAiName,
}: Step3Props) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiImages, setAIImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const generateAIImages = async (file: File) => {
    console.log("API request File : ", file);
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        "https://genai-exchange-llm-api-3.onrender.com/gen-images-name-category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setAIImages(response.data.data.images);
      setAiCategory(response.data.data.category);
      setAiName(response.data.data.titles[0]);
    } catch (err) {
      console.log({ err });
    }
  };

  const imageUrlToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // important for AI image URLs
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context not available");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFilesChange = async (files: File[]) => {
    console.log(files);
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setSelectedImage(null); // Reset selection
      setAIImages([]); // Reset AI images

      // Create URL for original image preview
      const imageUrl = URL.createObjectURL(file);
      console.log("Image URL", imageUrl);
      setOriginalImageUrl(imageUrl);

      // Generate AI images
      setIsGenerating(true);
      try {
        const generatedImages = await generateAIImages(file);
        console.log("From handleFilesChange: ", generatedImages);
      } catch (error) {
        console.error("Failed to generate AI images:", error);
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Reset everything when no file

      setUploadedFile(null);
      setAIImages([]);
      setSelectedImage(null);
      setOriginalImageUrl(null);
    }
  };

  const handleImageSelect = async (imageUrl: string) => {
    setSelectedImage(imageUrl);

    try {
      const base64 = await imageUrlToBase64(imageUrl);
      localStorage.setItem("ImageBase64", base64);
      console.log("Stored selected image in localStorage");
    } catch (err) {
      console.error("Failed to convert selected image to Base64:", err);
    }
  };

  const allImages = originalImageUrl ? [originalImageUrl, ...aiImages] : [];
  const canProceed = selectedImage !== null;

  return (
    <motion.div
      key="step3"
      custom={direction}
      initial={{ x: direction === "forward" ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? -80 : 80, opacity: 0 }}
      className=" w-full"
    >
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold font-outfit! tracking-wide md:text-xl mb-6 text-md flex  items-center gap-2">
          <ImageIcon />
          Step 1: Get Started by Uploading A Photo of your Product
        </h2>

        <div
          className={`space-y-6 block md:flex md:items-center ${
            uploadedFile ? "md:justify-evenly" : "md:justify-center"
          }`}
        >
          <FileUploader onFilesChange={handleFilesChange} maxFiles={1} />

          {/* AI Generation Status */}
          {uploadedFile && (
            <div className="border-t pt-6 md:border-t-0 md:ml-8 ">
              {isGenerating ? (
                <div className="flex w-full">
                  <div className="text-center py-8 ">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Creating AI-Enhanced Versions
                    </h3>
                    <p className="text-sm text-gray-500">
                      Our AI is working on improving your product photo...
                    </p>
                  </div>
                </div>
              ) : allImages.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Choose Your Perfect Photo
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Select the image that best represents your product
                  </p>

                  {/* Image Selection Grid */}
                  <div className="grid grid-cols-2 space-y-2">
                    {allImages.map((imageUrl, index) => (
                      <div key={imageUrl} className="relative mx-2">
                        <button
                          onClick={() => handleImageSelect(imageUrl)}
                          className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-4 hover:border-amber-500! ${
                            selectedImage === imageUrl
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={
                              index === 0 ? "Original" : `AI Enhanced ${index}`
                            }
                            className="w-full h-full object-cover"
                          />

                          {/* Selection Indicator */}
                          {selectedImage === imageUrl && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}

                          {/* Image Label */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-2">
                            {index === 0 ? "Original" : `AI Enhanced`}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedImage && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Perfect! You've selected your product image.
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>

          <Button
            disabled={!canProceed}
            className={`${
              canProceed
                ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300!"
            } transition-all duration-200`}
            onClick={() => {
              onNext();
            }}
          >
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
