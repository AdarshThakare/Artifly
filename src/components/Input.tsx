import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3">{icon}</span>}
        <input
          className={`w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            icon ? "pl-10" : ""
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
