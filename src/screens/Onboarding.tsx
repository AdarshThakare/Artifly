import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Footer } from "../components/Footer";
import { FileUploader } from "../components/FileUploader";
import { VoiceRecorder } from "../components/VoiceRecorder";
import { TagChip } from "../components/Tag";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, MapPin, Palette } from "lucide-react";

interface OnboardingData {
  name: string;
  craftType: string;
  location: string;
  images: File[];
  transcript: string;
  aiStory: string;
  tags: string[];
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    craftType: "",
    location: "",
    images: [],
    transcript: "",
    aiStory: "",
    tags: [],
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generateAIStory = () => {
    const story = `Meet ${
      data.name
    }, a passionate ${data.craftType.toLowerCase()} artisan from ${
      data.location
    }. ${data.transcript} Each piece reflects years of dedication.`;
    const generatedTags = [
      "handmade",
      "artisan-crafted",
      "unique-design",
      "traditional",
      "premium-quality",
    ];
    setData((prev) => ({ ...prev, aiStory: story, tags: generatedTags }));
  };

  const removeTag = (tagToRemove: string) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">Get Started as an Artisan</h1>
              <span className="text-sm text-gray-500">
                Step {currentStep} of 3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <Card>
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-blue-600" /> Tell Us About
                Yourself
              </h2>
              <div className="space-y-4">
                <Input
                  label="Your Name"
                  value={data.name}
                  onChange={(e) =>
                    setData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Enter your full name"
                />

                <Select
                  label="What Type of Craft?"
                  value={data.craftType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setData((p) => ({ ...p, craftType: e.target.value }))
                  }
                  options={[
                    { value: "pottery", label: "Pottery" },
                    { value: "jewelry", label: "Jewelry" },
                    { value: "woodworking", label: "Woodworking" },
                    { value: "painting", label: "Painting" },
                  ]}
                />

                <Input
                  label="Location"
                  value={data.location}
                  onChange={(e) =>
                    setData((p) => ({ ...p, location: e.target.value }))
                  }
                  placeholder="City, Country"
                  icon={<MapPin className="h-4 w-4 text-gray-400" />}
                />

                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={!data.name || !data.craftType || !data.location}
                  >
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <Card>
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-blue-600" /> Upload Your Craft
                Photos
              </h2>
              <FileUploader
                onFilesChange={(files) =>
                  setData((p) => ({ ...p, images: files }))
                }
                maxFiles={5}
              />

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={data.images.length === 0}
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <h2 className="font-semibold text-lg mb-4">
                  Share Your Craft Story
                </h2>
                <VoiceRecorder
                  transcript={data.transcript}
                  onTranscriptChange={(t) =>
                    setData((p) => ({ ...p, transcript: t }))
                  }
                />
              </Card>

              {data.transcript && (
                <Card>
                  <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-blue-600" /> AI Story &
                    Tags
                  </h2>
                  {!data.aiStory ? (
                    <Button onClick={generateAIStory}>
                      <Sparkles className="h-5 w-5 mr-2" /> Generate Story
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-100 rounded">
                        {data.aiStory}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {data.tags.map((tag) => (
                          <TagChip
                            key={tag}
                            tag={tag}
                            variant="ai-generated"
                            onRemove={() => removeTag(tag)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    {data.aiStory && (
                      <Button>
                        <Link to="/dashboard">
                          Complete Setup <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
