import React, { useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

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
        className={`p-8 border-2 md:w-md border-solid shadow-sm transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50!"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col text-center py-10 items-center justify-center space-y-4">
          <ImageIcon className="h-18 w-18 text-blue-400 hover:text-blue-500 " />
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
            <Upload className="h-4 w-4 mr-2" />
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

          {files.length > 0 && (
            <>
              <div className="w-full h-0 my-3 mb-7 rounded-full border-t-1" />
              <h3 className="text-lg font-semibold text-gray-900">
                Your Selected Image:-
              </h3>
              <div className="flex justify-center w-2 md:w-3">
                {files.map((file, index) => (
                  <Card key={index} className="relative p-2">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600"
                        onClick={() => removeFile(index)}
                      >
                        <X className="absolute h-4 w-4 text-white" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {file.name}
                    </p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
