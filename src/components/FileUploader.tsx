import React, { useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

// Replace with your own components (or keep plain HTML + Tailwind)
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`rounded-xl shadow-sm bg-white ${className}`} {...props}>
    {children}
  </div>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "outline" | "destructive";
  }
> = ({ children, className = "", variant, ...props }) => {
  let base =
    "px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center";
  let variants: Record<string, string> = {
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      className={`${base} ${variant ? variants[variant] : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export function FileUploader({
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = ["image/*"],
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const fileArray = Array.from(newFiles).slice(0, maxFiles);
      setFiles(fileArray);
      onFilesChange(fileArray);
    },
    [maxFiles, onFilesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Your Craft Photos
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your images here, or click to browse
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      </Card>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <Card key={index} className="relative p-2">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 truncate">{file.name}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
