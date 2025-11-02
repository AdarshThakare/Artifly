import React, { useState, useRef } from "react";
import { Mic, MicOff, Play, Pause } from "lucide-react";

// Card & Button components as you already have

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`rounded-xl shadow bg-white border ${className}`} {...props}>
    {children}
  </div>
);

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm;codecs=opus";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/ogg;codecs=opus";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = ""; // Let browser decide
      }
      const options = { mimeType: mimeType };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          // send chunk to backend
          await sendChunk(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000); // collect every 1 second
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const sendChunk = async (chunk: BlobPart) => {
    const blob = new Blob([chunk], { type: "audio/webm" });
    const arrayBuffer = await blob.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    try {
      const response = await fetch("http://localhost:3000/api/v1/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "audio/webm",
        },
        body: uint8,
      });
      const data = await response.json();
      if (data.transcript) {
        onTranscriptChange(transcript + " " + data.transcript);
      }
    } catch (err) {
      console.error("Error sending chunk:", err);
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
              onClick={() => handleStartRecording()}
              size="lg"
              className="rounded-full"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={() => handleStopRecording()}
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
