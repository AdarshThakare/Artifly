import React from "react";
import { X } from "lucide-react";
// Minimal Button replacement
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost" | "default";
    size?: "sm" | "md";
  }
> = ({ children, className = "", variant, size = "md", ...props }) => {
  const base = "rounded-md flex items-center justify-center transition-colors";
  const sizes: Record<string, string> = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
  };
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${
        variant ? variants[variant] : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface TagChipProps {
  tag: string;
  onRemove?: () => void;
  variant?: "default" | "ai-generated";
}

export function TagChip({ tag, onRemove, variant = "default" }: TagChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
        variant === "ai-generated"
          ? "bg-accent/20 text-accent-foreground border border-accent/30"
          : "bg-secondary/20 text-secondary-foreground border border-secondary/30"
      }`}
    >
      {variant === "ai-generated" && <span className="text-xs">✨</span>}
      <span>{tag}</span>
      {onRemove && (
        <Button
          size="sm"
          variant="ghost"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
