import React, { useState } from "react";
import { Mic, MicOff, Play, Pause } from "lucide-react";

// Simple Card replacement
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`rounded-xl shadow bg-white border ${className}`} {...props}>
    {children}
  </div>
);

// Simple Button replacement
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "destructive";
    size?: "sm" | "lg";
  }
> = ({
  children,
  className = "",
  variant = "default",
  size = "sm",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors";
  const sizes: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    lg: "px-5 py-2 text-base",
  };
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  transcript: string;
}

export function VoiceRecorder({
  onTranscriptChange,
  transcript,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording - in real app, would use Web Speech API
    setTimeout(() => {
      const sampleTranscript =
        "I've been crafting pottery for over 20 years. Each piece is hand-thrown on my wheel using local clay from the riverbank near my studio. This particular vase features a unique glaze technique I developed that creates these beautiful earth-tone patterns.";
      onTranscriptChange(sampleTranscript);
      setIsRecording(false);
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Voice Recording
        </h3>
        <p className="text-sm text-muted-foreground">
          Tell us about your craft in your own words
        </p>

        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              size="lg"
              className="rounded-full"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              variant="destructive"
              size="lg"
              className="rounded-full"
            >
              <MicOff className="h-5 w-5 mr-2" />
              Stop Recording
            </Button>
          )}

          {transcript && (
            <Button
              onClick={togglePlayback}
              variant="outline"
              size="lg"
              className="rounded-full bg-transparent"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 mr-2" />
              ) : (
                <Play className="h-5 w-5 mr-2" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-8 bg-primary rounded-full animate-bounce"></div>
              <div
                className="w-2 h-6 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-10 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-6 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="w-2 h-8 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}

        {transcript && (
          <div className="mt-4 p-4 bg-muted rounded-lg text-left">
            <h4 className="font-medium text-foreground mb-2">Transcript:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {transcript}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
