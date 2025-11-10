import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Play, Pause, Loader2 } from "lucide-react";
import axios from "axios";

// 🩵 Reusable Card
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`rounded-2xl shadow-lg bg-white/80 border border-gray-200 p-8 backdrop-blur-md transition-all ${className}`}
    {...props}
  >
    {children}
  </div>
);

// 🩵 Reusable Button
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
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:ring-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
  };
  return (
    <button
      disabled={disabled}
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(55);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any | null>(null);

  // 🕒 Timer logic
  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRecording) {
      handleStopRecording();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRecording, timeLeft]);

  // 🎙️ Start recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setTimeLeft(55);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(blob);
        setAudioUrl(audioURL);
        await sendToBackend(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Please enable microphone access to record.");
    }
  };

  // ⏹️ Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  // ▶️ Play / Pause
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // 🎧 Send blob to backend
  const sendToBackend = async (blob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const res = await axios.post(
        "http://localhost:3000/api/transcribe",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success && res.data.transcript) {
        onTranscriptChange(res.data.transcript);
      } else {
        alert("No transcript received.");
      }
    } catch (err) {
      console.error("Error sending audio:", err);
      alert("Failed to send audio.");
    } finally {
      setLoading(false);
    }
  };

  // 🔊 Clean synced audio bars (smooth pulse effect)
  const AudioVisualizer = () => (
    <div className="flex justify-center mt-4 space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2 rounded-full bg-blue-600 animate-pulse"
          style={{
            height: `${6 + Math.abs(Math.sin(Date.now() / 200 + i)) * 10}px`,
            transition: "height 0.2s ease-in-out",
          }}
        ></div>
      ))}
    </div>
  );

  return (
    <Card className="max-w-xl mx-auto mt-6">
      <div className="text-center space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900 flex justify-center items-center gap-2">
          🎤 Voice Recorder
        </h3>
        <p className="text-sm text-gray-500">
          Tell us about your craft in your own words.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              size="lg"
              disabled={loading}
              className="min-w-[180px]"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              variant="destructive"
              size="lg"
              className="min-w-[180px]"
            >
              <MicOff className="h-5 w-5 mr-2" />
              Stop Recording
            </Button>
          )}

          {audioUrl && (
            <Button
              onClick={togglePlayback}
              variant="outline"
              size="lg"
              disabled={loading}
              className="min-w-[140px]"
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

        {/* 🕒 Timer + Visualizer */}
        {isRecording && (
          <div className="flex flex-col items-center space-y-2 mt-3">
            <div className="text-lg font-medium text-blue-700">
              ⏱ {timeLeft}s remaining
            </div>
            <AudioVisualizer />
          </div>
        )}

        {/* 🎧 Hidden Audio */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* 📜 Transcript */}
        {loading ? (
          <div className="flex justify-center items-center gap-2 text-gray-500 mt-4">
            <Loader2 className="animate-spin h-5 w-5" />
            Transcribing your voice...
          </div>
        ) : transcript ? (
          <div className="mt-6 p-5 bg-blue-50 rounded-xl text-left shadow-inner border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Transcript:</h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {transcript}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
