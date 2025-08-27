import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 shadow-sm bg-white p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
