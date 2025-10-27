// src/components/ProtectedRoute.jsx
import React, { type ReactNode } from "react";
import { useUser, SignIn } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  // Wait for Clerk to finish loading
  if (!isLoaded) return null;

  // If not signed in, show sign-in modal
  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SignIn
          routing="virtual" // use modal-style (no redirect)
          appearance={{
            elements: {
              card: "shadow-xl border border-gray-200 rounded-2xl",
            },
          }}
        />
      </div>
    );
  }

  // Otherwise, show the actual protected content
  return children;
};

export default ProtectedRoute;
