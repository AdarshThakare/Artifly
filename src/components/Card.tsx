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

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b">{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
