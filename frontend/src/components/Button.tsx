export function Button({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition font-outfit! tracking-wider ";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "text-red-600 hover:bg-red-50 border border-red-200",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
