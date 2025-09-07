import React, { useState } from "react";
import { Menu, X, Palette } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost" | "default";
  }
> = ({ children, className = "", variant, ...props }) => {
  const base = "px-3 py-2 rounded-lg font-medium text-sm transition-colors";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100",
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Artivio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary">
              Home
            </Link>
            <Link
              to="/onboarding"
              className="text-foreground hover:text-primary"
            >
              Get Started
            </Link>
            {isSignedIn && (
              <Link
                to="/dashboard"
                className="text-foreground hover:text-primary"
              >
                Dashboard
              </Link>
            )}
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button variant="default">Sign in</Button>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-xl! bg-card border-t border-border">
              <Link
                to="/"
                className="block px-3 py-2 text-foreground  hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/onboarding"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
              {isSignedIn && (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <Button variant="default" className="w-full">
                    Sign in
                  </Button>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
