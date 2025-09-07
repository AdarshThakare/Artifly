import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "../components/Footer";
import Step1Basics from "../components/onboarding/basics";
import Step2Story from "../components/onboarding/story";
import Step3Upload from "../components/onboarding/upload";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleNext = () => {
    setDirection("forward");
    setCurrentStep((s) => Math.min(3, s + 1));
  };

  const handlePrevious = () => {
    setDirection("backward");
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  return (
    <>
      <div className="h-[calc(100vh-64px)] flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <div className="flex-1 py-12">
          <div className="max-w-3xl mx-auto px-4">
            {/* Progress Header */}
            <motion.div layout className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <h1 className="text-3xl 2xl:text-4xl  font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  Showcase Your Craft
                </h1>
                <span className="text-md text-gray-500">
                  Step {currentStep} of 3
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2 rounded-full shadow-inner"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 3) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Step Content */}
            <div className="relative min-h-[420px]">
              <AnimatePresence custom={direction} mode="wait">
                {currentStep === 1 && (
                  <Step1Basics
                    key="step1"
                    direction={direction}
                    onNext={handleNext}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                )}

                {currentStep === 2 && (
                  <Step2Story
                    key="step2"
                    direction={direction}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Upload
                    key="step3"
                    direction={direction}
                    onPrevious={handlePrevious}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
