import { Palette } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold text-foreground">
                ARTIFLY
              </span>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Empowering local artisans with AI-powered tools to showcase their
              crafts, tell their stories, and connect with customers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-md">
              <li>
                <a
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/onboarding"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Get Started
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-md">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-md">
            © 2025 ARTIFLY. Made by NEXTGEN-CODECRAFTERS
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary text-md transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary text-md transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// //DARK
// import { Palette, Heart } from "lucide-react";

// export function Footer() {
//   return (
//     <footer className="bg-muted-foreground  border-border mt-auto z-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Logo and Description */}
//           <div className="col-span-1 md:col-span-2">
//             <div className="flex items-center space-x-2 mb-4">
//               <Palette className="h-8 w-8 text-primary" />
//               <span className="text-xl font-bold text-background">ARTIFLY</span>
//             </div>
//             <p className="text-background text-md leading-relaxed max-w-md">
//               Empowering local artisans with AI-powered tools to showcase their
//               crafts, tell their stories, and connect with customers worldwide.
//             </p>
//           </div>
//           {/* Quick Links */}
//           <div>
//             <h3 className="font-semibold text-background mb-4">Quick Links</h3>
//             <ul className="space-y-2 text-md">
//               <li>
//                 <a
//                   href="/"
//                   className="text-background hover:text-primary transition-colors"
//                 >
//                   Home
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/onboarding"
//                   className="text-background hover:text-primary transition-colors"
//                 >
//                   Get Started
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/dashboard"
//                   className="text-background hover:text-primary transition-colors"
//                 >
//                   Dashboard
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="font-semibold text-background mb-4">Support</h3>
//             <ul className="space-y-2 text-md">
//               <li>
//                 <a
//                   href="#"
//                   className="text-background hover:text-primary transition-colors"
//                 >
//                   Help Center
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-background hover:text-primary transition-colors"
//                 >
//                   Contact Us
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-background hover:text-primary transition-colors"
//                 >
//                   Community
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
//           <p className="text-background text-md">
//             © 2024 ARTIFLY. Made with{" "}
//             <Heart className="h-4 w-4 text-primary inline mx-1" /> for artisans.
//           </p>
//           <div className="flex space-x-6 mt-4 sm:mt-0">
//             <a
//               href="#"
//               className="text-background hover:text-primary text-md transition-colors"
//             >
//               Privacy Policy
//             </a>
//             <a
//               href="#"
//               className="text-background hover:text-primary text-md transition-colors"
//             >
//               Terms of Service
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
