import { motion } from "framer-motion";
import { Card } from "../Card";
import { Button } from "../Button";
import { VoiceRecorder } from "../VoiceRecorder";
import { Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Step2Props {
  direction: "forward" | "backward";
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step2Story({
  direction,
  onNext,
  onPrevious,
}: Step2Props) {
  const [transcript, setTranscript] = useState("");
  const [typedText, setTypedText] = useState("");

  return (
    <motion.div
      key="step2"
      custom={direction}
      initial={{ x: direction === "forward" ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? -80 : 80, opacity: 0 }}
      className="absolute w-full"
    >
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
          <Tag className="h-6 w-6 text-blue-600" /> Cultural Story
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

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button
            onClick={() => {
              const finalStory = typedText || transcript;
              if (!finalStory) return; // prevent empty
              console.log("User's story:", finalStory);
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
