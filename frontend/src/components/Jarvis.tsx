// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Bot,
//   Image as ImageIcon,
//   Sparkles,
//   TrendingUp,
//   BookOpen,
//   Instagram,
//   ShoppingBag,
//   Network,
//   X,
//   Mic,
//   MicOff,
//   ChevronRight,
//   ChevronLeft,
//   CheckCircle,
//   HelpCircle,
//   ArrowLeft,
//   Home,
//   Palette,
//   FileText,
//   BarChart3,
//   Zap,
//   DollarSign,
// } from "lucide-react";

// // TypeScript declarations for Web Speech API
// declare global {
//   interface Window {
//     SpeechRecognition: typeof SpeechRecognition;
//     webkitSpeechRecognition: typeof SpeechRecognition;
//   }

//   interface SpeechRecognition extends EventTarget {
//     continuous: boolean;
//     interimResults: boolean;
//     lang: string;
//     maxAlternatives: number;
//     onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
//     onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
//     onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown) | null;
//     onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
//     start(): void;
//     stop(): void;
//     abort(): void;
//   }

//   var SpeechRecognition: {
//     prototype: SpeechRecognition;
//     new (): SpeechRecognition;
//   };

//   interface SpeechRecognitionEvent extends Event {
//     readonly resultIndex: number;
//     readonly results: SpeechRecognitionResultList;
//   }

//   interface SpeechRecognitionResultList {
//     readonly length: number;
//     item(index: number): SpeechRecognitionResult;
//     [index: number]: SpeechRecognitionResult;
//   }

//   interface SpeechRecognitionResult {
//     readonly length: number;
//     item(index: number): SpeechRecognitionAlternative;
//     [index: number]: SpeechRecognitionAlternative;
//     readonly isFinal: boolean;
//   }

//   interface SpeechRecognitionAlternative {
//     readonly transcript: string;
//     readonly confidence: number;
//   }

//   interface SpeechRecognitionErrorEvent extends Event {
//     readonly error: string;
//     readonly message: string;
//   }
// }

// // Types
// interface Message {
//   type: "user" | "artifly";
//   text: string;
// }

// interface RouteConfig {
//   path: string;
//   name: string;
//   icon: string;
//   description: string;
//   details: string;
// }

// interface ArtiflyEntry {
//   title: string;
//   questions: string;
//   answers: string;
//   toolContext: string;
//   createdAt: string;
// }

// type Mode = "doubt" | "beginner" | null;
// type SubMode =
//   | "waiting_for_selection"
//   | "waiting_for_tool_selection"
//   | "waiting_for_step_selection"
//   | "explaining_tab"
//   | "waiting_for_question"
//   | "resolving_doubt"
//   | "tour_complete"
//   | "process_ended"
//   | null;

// export default function Chatbot() {
//   const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
//   const [response, setResponse] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
//   const [isListening, setIsListening] = useState<boolean>(false);
//   const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
//   const [transcript, setTranscript] = useState<string>("");
//   const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
//   const [tooltipVisible, setTooltipVisible] = useState<string>("");
//   const [mode, setMode] = useState<Mode>(null);
//   const [subMode, setSubMode] = useState<SubMode>(null);
//   const [targetRoute, setTargetRoute] = useState<string | null>(null);
//   const [currentToolIndex, setCurrentToolIndex] = useState<number>(0);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [selectedTool, setSelectedTool] = useState<RouteConfig | null>(null);
//   const [completedSteps, setCompletedSteps] = useState<string[]>(
//     JSON.parse(localStorage.getItem("artisanProgress") || "[]")
//   );

//   const recognitionRef = useRef<SpeechRecognition | null>(null);
//   const isCleaningUp = useRef<boolean>(false);
//   const recognitionState = useRef<string>("idle");
//   const conversationRef = useRef<HTMLDivElement | null>(null);
//   const lastProcessedRoute = useRef<string | null>(null);
//   const recognitionLock = useRef<boolean>(false);

//   const navigate = useNavigate();

//   // API Key - Use environment variable in production
//   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

//   // Dashboard routes for artisan platform
//   const dashboardRoutes: RouteConfig[] = [
//     {
//       path: "/dashboard/image-upload",
//       name: "Image Upload",
//       icon: "ImageIcon",
//       description: "Upload and manage product images",
//       details:
//         "Upload up to 10 high-quality images in JPG, PNG, or WEBP format to showcase your artisan products beautifully.",
//     },
//     {
//       path: "/dashboard/ai-enhancement",
//       name: "AI Enhancement",
//       icon: "Sparkles",
//       description: "Auto-enhance lighting, color, and clarity",
//       details:
//         "Use AI to automatically improve your product photos with enhanced lighting, vibrant colors, and crystal-clear clarity.",
//     },
//     {
//       path: "/dashboard/ai-descriptions",
//       name: "AI Descriptions",
//       icon: "FileText",
//       description: "Generate SEO-optimized product descriptions",
//       details:
//         "Create compelling, SEO-friendly product descriptions that highlight cultural context and craftsmanship.",
//     },
//     {
//       path: "/dashboard/trend-insights",
//       name: "Trend Insights",
//       icon: "TrendingUp",
//       description: "Real-time market trends and data",
//       details:
//         "Access current market trends, popular colors, pricing insights, and consumer preferences in the artisan marketplace.",
//     },
//     {
//       path: "/dashboard/story-builder",
//       name: "Story Builder",
//       icon: "BookOpen",
//       description: "Craft heritage narratives",
//       details:
//         "Build authentic stories around your craft, highlighting traditional techniques, cultural heritage, and personal journey.",
//     },
//     {
//       path: "/dashboard/instagram-auto-post",
//       name: "Instagram Auto-Post",
//       icon: "Instagram",
//       description: "Schedule posts with AI captions",
//       details:
//         "Automate your Instagram presence with scheduled posts, AI-generated captions, and optimal timing for maximum engagement.",
//     },
//     {
//       path: "/dashboard/marketplace-integration",
//       name: "Marketplace Integration",
//       icon: "ShoppingBag",
//       description: "Connect to Etsy, Amazon Handmade, etc.",
//       details:
//         "Seamlessly integrate with major artisan marketplaces like Etsy, Amazon Handmade, and more to expand your reach.",
//     },
//     {
//       path: "/dashboard/audience-analytics",
//       name: "Audience Analytics",
//       icon: "BarChart3",
//       description: "Track demographics and engagement",
//       details:
//         "Understand your audience with detailed analytics on demographics, engagement patterns, and buying behavior.",
//     },
//     {
//       path: "/dashboard/smart-pricing",
//       name: "Smart Pricing",
//       icon: "DollarSign",
//       description: "AI-driven price recommendations",
//       details:
//         "Get intelligent pricing suggestions based on materials, time, market demand, and competitor analysis.",
//     },
//     {
//       path: "/dashboard/artisan-network",
//       name: "Artisan Network",
//       icon: "Network",
//       description: "Community collaboration hub",
//       details:
//         "Connect with fellow artisans, share techniques, collaborate on projects, and build a supportive creative community.",
//     },
//   ];

//   // Artisan workflow steps
//   const artisanWorkflowSteps: RouteConfig[] = [
//     {
//       path: "/dashboard/image-upload",
//       name: "Step 1: Image Upload",
//       description: "Upload your artisan product photos",
//       icon: "ImageIcon",
//       details:
//         "Begin by uploading high-quality images of your handcrafted products. Support for JPG, PNG, and WEBP formats.",
//     },
//     {
//       path: "/dashboard/ai-enhancement",
//       name: "Step 2: AI Enhancement",
//       description: "Enhance image quality with AI",
//       icon: "Sparkles",
//       details:
//         "Let AI automatically improve your photos with better lighting, color correction, and enhanced clarity for professional results.",
//     },
//     {
//       path: "/dashboard/ai-descriptions",
//       name: "Step 3: AI Descriptions",
//       description: "Generate product descriptions",
//       icon: "FileText",
//       details:
//         "Create engaging, SEO-optimized descriptions that tell your product's story and connect with buyers emotionally.",
//     },
//     {
//       path: "/dashboard/story-builder",
//       name: "Step 4: Story Builder",
//       description: "Build your brand narrative",
//       icon: "BookOpen",
//       details:
//         "Craft authentic stories about your craft, techniques, and heritage to create deeper connections with customers.",
//     },
//     {
//       path: "/dashboard/smart-pricing",
//       name: "Step 5: Smart Pricing",
//       description: "Set competitive prices",
//       icon: "DollarSign",
//       details:
//         "Use AI-powered insights to price your products competitively while ensuring fair compensation for your artistry.",
//     },
//     {
//       path: "/dashboard/instagram-auto-post",
//       name: "Step 6: Instagram Auto-Post",
//       description: "Schedule social media posts",
//       icon: "Instagram",
//       details:
//         "Automate your Instagram marketing with scheduled posts, AI captions, and hashtag suggestions for maximum reach.",
//     },
//     {
//       path: "/dashboard/marketplace-integration",
//       name: "Step 7: Marketplace Integration",
//       description: "Connect to marketplaces",
//       icon: "ShoppingBag",
//       details:
//         "Link your products to popular artisan marketplaces and expand your sales channels effortlessly.",
//     },
//     {
//       path: "/dashboard/audience-analytics",
//       name: "Step 8: Audience Analytics",
//       description: "Track performance metrics",
//       icon: "BarChart3",
//       details:
//         "Monitor your audience engagement, sales patterns, and marketing effectiveness with comprehensive analytics.",
//     },
//     {
//       path: "/dashboard/artisan-network",
//       name: "Step 9: Artisan Network",
//       description: "Connect with community",
//       icon: "Network",
//       details:
//         "Join a vibrant community of artisans to share ideas, collaborate, and grow your business together.",
//     },
//   ];

//   // Suggested questions per tool
//   const suggestedQuestions: Record<string, string[]> = {
//     "/dashboard/image-upload": [
//       "What image formats are supported?",
//       "How many images can I upload at once?",
//       "What's the recommended image size?",
//     ],
//     "/dashboard/ai-enhancement": [
//       "How does AI enhancement work?",
//       "Can I control the enhancement level?",
//       "Will enhancement change my product's colors?",
//     ],
//     "/dashboard/ai-descriptions": [
//       "How does AI generate descriptions?",
//       "Can I customize the writing style?",
//       "How is SEO optimization done?",
//     ],
//     "/dashboard/trend-insights": [
//       "What trends should I follow?",
//       "How often is data updated?",
//       "Can I see trend predictions?",
//     ],
//     "/dashboard/story-builder": [
//       "How do I craft a compelling story?",
//       "Can I include my heritage?",
//       "What makes a good artisan story?",
//     ],
//     "/dashboard/instagram-auto-post": [
//       "How do I schedule posts?",
//       "What makes good AI captions?",
//       "When is the best time to post?",
//     ],
//     "/dashboard/marketplace-integration": [
//       "Which marketplaces are supported?",
//       "How does integration work?",
//       "Can I sync inventory automatically?",
//     ],
//     "/dashboard/audience-analytics": [
//       "What metrics are tracked?",
//       "How do I understand my audience?",
//       "Can I export analytics data?",
//     ],
//     "/dashboard/smart-pricing": [
//       "How is pricing calculated?",
//       "Should I include labor costs?",
//       "How do I stay competitive?",
//     ],
//     "/dashboard/artisan-network": [
//       "How do I connect with artisans?",
//       "Can I collaborate on projects?",
//       "Is there a community forum?",
//     ],
//   };

//   // Icon mapping
//   const iconMap: Record<string, JSX.Element> = {
//     Home: <Home className="h-4 w-4" />,
//     ImageIcon: <ImageIcon className="h-4 w-4" />,
//     Sparkles: <Sparkles className="h-4 w-4" />,
//     FileText: <FileText className="h-4 w-4" />,
//     TrendingUp: <TrendingUp className="h-4 w-4" />,
//     BookOpen: <BookOpen className="h-4 w-4" />,
//     Instagram: <Instagram className="h-4 w-4" />,
//     ShoppingBag: <ShoppingBag className="h-4 w-4" />,
//     BarChart3: <BarChart3 className="h-4 w-4" />,
//     DollarSign: <DollarSign className="h-4 w-4" />,
//     Network: <Network className="h-4 w-4" />,
//     Bot: <Bot className="h-4 w-4" />,
//     Palette: <Palette className="h-4 w-4" />,
//     Zap: <Zap className="h-4 w-4" />,
//   };

//   // Normalize path
//   const normalizePath = (path: string): string => {
//     if (!path || typeof path !== "string") {
//       console.warn(`Invalid path: ${path}, returning default '/dashboard'`);
//       return "/dashboard";
//     }
//     return path.replace(/\/+$/, "").toLowerCase();
//   };

//   // Check if Speech Recognition is supported
//   const isSpeechRecognitionSupported = (): boolean => {
//     return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
//   };

//   // Create speech recognition
//   const createRecognition = (): SpeechRecognition | null => {
//     try {
//       if (!isSpeechRecognitionSupported()) {
//         console.error("SpeechRecognition API not supported.");
//         return null;
//       }

//       const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognitionAPI();
//       recognition.lang = "en-US";
//       recognition.interimResults = false;
//       recognition.maxAlternatives = 1;
//       recognition.continuous = true;
//       return recognition;
//     } catch (error) {
//       console.error("Error creating speech recognition:", error);
//       return null;
//     }
//   };

//   // Setup recognition handlers
//   const setupRecognition = (recognition: SpeechRecognition) => {
//     recognition.onstart = () => {
//       console.log("Recognition started");
//       setIsRecognizing(true);
//       recognitionState.current = "active";
//     };

//     recognition.onresult = async (event: SpeechRecognitionEvent) => {
//       const speechResult =
//         event.results[event.results.length - 1][0].transcript.trim();
//       console.log(`Captured transcript: "${speechResult}"`);
//       setTranscript(speechResult);
//       setConversationHistory((prev) => [
//         ...prev,
//         { type: "user", text: speechResult },
//       ]);

//       if (
//         speechResult.toLowerCase().includes("stop") ||
//         speechResult.toLowerCase().includes("thank you")
//       ) {
//         console.log("Stop command detected, stopping conversation");
//         await stopConversation();
//         return;
//       }

//       await fetchResponse(speechResult);
//     };

//     recognition.onend = async () => {
//       console.log(
//         `Recognition ended - isListening: ${isListening}, isSpeaking: ${isSpeaking}`
//       );
//       setIsRecognizing(false);
//       recognitionState.current = "idle";
//       if (
//         !isCleaningUp.current &&
//         !isSpeaking &&
//         isListening &&
//         mode === "doubt"
//       ) {
//         console.log("Restarting recognition");
//         await startRecognition();
//       }
//     };

//     recognition.onerror = async (event: SpeechRecognitionErrorEvent) => {
//       console.error(`Speech recognition error: ${event.error}`);
//       setIsRecognizing(false);
//       recognitionState.current = "idle";
//       if (
//         event.error === "no-speech" &&
//         !isCleaningUp.current &&
//         isListening &&
//         mode === "doubt"
//       ) {
//         const message = "I didn't hear anything. Please try again.";
//         setConversationHistory((prev) => [
//           ...prev,
//           { type: "artifly", text: message },
//         ]);
//         await speakResponse(message);
//         await startRecognition();
//       } else if (event.error !== "aborted") {
//         recognitionRef.current = null;
//         if (!isCleaningUp.current && isListening && mode === "doubt") {
//           await startRecognition();
//         }
//       }
//     };
//   };

//   // Start recognition
//   const startRecognition = async (retryCount = 0): Promise<void> => {
//     if (recognitionLock.current || isCleaningUp.current || isSpeaking) {
//       console.log("Recognition blocked");
//       if (isSpeaking && retryCount < 3) {
//         await new Promise((resolve) => setTimeout(resolve, 500));
//         await startRecognition(retryCount + 1);
//       }
//       return;
//     }

//     recognitionLock.current = true;

//     try {
//       if (
//         recognitionRef.current &&
//         (isRecognizing || recognitionState.current === "active")
//       ) {
//         recognitionRef.current.stop();
//         await new Promise((resolve) => setTimeout(resolve, 200));
//       }

//       if (!recognitionRef.current) {
//         recognitionRef.current = createRecognition();
//         if (!recognitionRef.current) {
//           recognitionLock.current = false;
//           const errorMessage =
//             "Speech recognition is not supported on this device. Please use a supported browser like Chrome or Edge.";
//           setConversationHistory((prev) => [
//             ...prev,
//             { type: "artifly", text: errorMessage },
//           ]);
//           await speakResponse(errorMessage);
//           setIsListening(false);
//           return;
//         }
//         setupRecognition(recognitionRef.current);
//       }

//       recognitionRef.current.start();
//       setIsListening(true);
//       setIsRecognizing(true);
//     } catch (error) {
//       console.error(`Error starting recognition: ${error}`);
//       setIsRecognizing(false);
//       recognitionState.current = "idle";

//       if (retryCount < 2) {
//         recognitionRef.current = null;
//         await new Promise((resolve) => setTimeout(resolve, 200));
//         await startRecognition(retryCount + 1);
//       } else {
//         const message =
//           "Sorry, I couldn't start speech recognition. Please try again or use a supported browser.";
//         setConversationHistory((prev) => [
//           ...prev,
//           { type: "artifly", text: message },
//         ]);
//         await speakResponse(message);
//         setIsListening(false);
//       }
//     } finally {
//       recognitionLock.current = false;
//     }
//   };

//   // Speak response
//   const speakResponse = async (text: string): Promise<void> => {
//     return new Promise((resolve) => {
//       if (!text || typeof text !== "string") {
//         console.error("Invalid text for speech synthesis:", text);
//         setIsSpeaking(false);
//         resolve();
//         return;
//       }

//       if (recognitionRef.current && isRecognizing) {
//         try {
//           recognitionRef.current.stop();
//           setIsRecognizing(false);
//           recognitionState.current = "idle";
//         } catch (error) {
//           console.error(`Error stopping recognition: ${error}`);
//         }
//       }

//       window.speechSynthesis.cancel();

//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = "en-US";
//       utterance.rate = 0.9;
//       utterance.onstart = () => {
//         setIsSpeaking(true);
//       };
//       utterance.onend = async () => {
//         setIsSpeaking(false);
//         if (mode === "doubt" && isListening && !isCleaningUp.current) {
//           await startRecognition();
//         }
//         resolve();
//       };
//       utterance.onerror = (event) => {
//         console.error(`Speech synthesis error: ${event.error}`);
//         setIsSpeaking(false);
//         resolve();
//       };
//       window.speechSynthesis.speak(utterance);
//     });
//   };

//   // Start conversation
//   const startConversation = async (selectedMode: Mode) => {
//     isCleaningUp.current = false;
//     setIsPanelOpen(true);
//     setIsListening(false);
//     setIsRecognizing(false);
//     setTranscript("");
//     setResponse("");
//     setConversationHistory([]);
//     setMode(selectedMode);
//     setSubMode(null);
//     setTargetRoute(null);
//     setCurrentToolIndex(0);
//     setSelectedTool(null);
//     setSelectedOption(null);
//     setCompletedSteps(
//       JSON.parse(localStorage.getItem("artisanProgress") || "[]")
//     );

//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (error) {
//         console.error(`Error stopping recognition: ${error}`);
//       }
//       recognitionRef.current = null;
//     }

//     let welcomeMessage = "";
//     if (selectedMode === "doubt") {
//       if (!isSpeechRecognitionSupported()) {
//         welcomeMessage =
//           "I am Artifly, here to help you with artisan marketing, but speech recognition is not supported on your browser. Please use Chrome or Edge for voice features.";
//         setConversationHistory([{ type: "artifly", text: welcomeMessage }]);
//         await speakResponse(welcomeMessage);
//         return;
//       }
//       welcomeMessage =
//         "I am Artifly, here to help you with artisan marketing, instagram automation, image enhancements, AI generated Description, selling your beautiful handcrafted products. Please speak your question.";
//       setConversationHistory([{ type: "artifly", text: welcomeMessage }]);
//       await speakResponse(welcomeMessage);
//       setIsListening(true);
//       await startRecognition();
//     } else if (selectedMode === "beginner") {
//       welcomeMessage =
//         "Welcome to Artifly! I'll guide you through our platform tools or the artisan workflow. Please select an option.";
//       setConversationHistory([{ type: "artifly", text: welcomeMessage }]);
//       await speakResponse(welcomeMessage);
//       setSubMode("waiting_for_selection");
//     }
//   };

//   // Stop conversation
//   const stopConversation = async () => {
//     setIsListening(false);
//     setIsRecognizing(false);

//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (error) {
//         console.error(`Error stopping recognition: ${error}`);
//       }
//       recognitionRef.current = null;
//     }

//     const goodbyeMessage = "Thank you for using Artifly!";
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: goodbyeMessage },
//     ]);

//     try {
//       await speakResponse(goodbyeMessage);
//     } catch (error) {
//       console.error("Error speaking goodbye message:", error);
//     }

//     isCleaningUp.current = true;
//     window.speechSynthesis.cancel();

//     setMode(null);
//     setSubMode(null);
//     setTargetRoute(null);
//     setCurrentToolIndex(0);
//     setSelectedTool(null);
//     setSelectedOption(null);
//     setCompletedSteps([]);
//     localStorage.setItem("artisanProgress", JSON.stringify([]));

//     setIsPanelOpen(false);
//     isCleaningUp.current = false;
//   };

//   // Fetch response from API
//   const fetchResponse = async (query: string) => {
//     setIsLoading(true);
//     const contextInfo = selectedTool
//       ? `Current tool context: ${selectedTool.name}. `
//       : "";
//     const problemStatement = `You are Artifly, an AI assistant for artisan digital marketing. Your goal is to help artists and craftspersons promote their work effectively through technology, storytelling, and design. Think deeply about the user's intent, context, and goals before answering. Silently plan your reasoning and analysis — do not display it. Then, provide only the final, polished answer — concise, clear, and practical (2–3 sentences max). ${contextInfo}

// Platform Features:
// 1. Image Upload: JPG/PNG/WEBP up to 10 images
// 2. AI Enhancement: Auto lighting, color, clarity improvement
// 3. AI Descriptions: SEO-optimized with cultural context
// 4. Trend Insights: Real-time market data, colors, pricing
// 5. Story Builder: Craft heritage narratives
// 6. Instagram Auto-Post: Scheduled posting with AI captions
// 7. Marketplace Integration: Etsy, Amazon Handmade, etc.
// 8. Audience Analytics: Demographics, engagement tracking
// 9. Smart Pricing: AI-driven price recommendations
// 10. Artisan Network: Community collaboration

// Workflow: Upload → AI enhance → AI descriptions → Auto Instagram post.

// User Query: ${query}`;

//     try {
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: [{ parts: [{ text: problemStatement }] }],
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Check if response has expected structure
//       if (
//         !data.candidates ||
//         !data.candidates[0] ||
//         !data.candidates[0].content ||
//         !data.candidates[0].content.parts ||
//         !data.candidates[0].content.parts[0]
//       ) {
//         throw new Error("Invalid response structure from API");
//       }

//       const text = data.candidates[0].content.parts[0].text;
//       setResponse(text);
//       setConversationHistory((prev) => [...prev, { type: "artifly", text }]);

//       // Speak response first
//       await speakResponse(text);

//       // Then store in localStorage (after successful speech)
//       try {
//         const artiflyEntry: ArtiflyEntry = {
//           title: `Query: ${query.slice(0, 50)}`,
//           questions: query,
//           answers: text,
//           toolContext: selectedTool?.name || "General",
//           createdAt: new Date().toISOString(),
//         };
//         const storedEntries = JSON.parse(
//           localStorage.getItem("artiflyEntries") || "[]"
//         );
//         storedEntries.push(artiflyEntry);
//         localStorage.setItem("artiflyEntries", JSON.stringify(storedEntries));
//       } catch (storageError) {
//         console.error("Error storing entry:", storageError);
//       }

//       // Update sub-mode if in beginner mode
//       if (
//         mode === "beginner" &&
//         (subMode === "resolving_doubt" || subMode === "waiting_for_question")
//       ) {
//         setSubMode("waiting_for_question");
//         const followUpPrompt =
//           "Would you like to ask another question or select a different tool/step?";
//         setConversationHistory((prev) => [
//           ...prev,
//           { type: "artifly", text: followUpPrompt },
//         ]);
//         await speakResponse(followUpPrompt);
//       }
//     } catch (error) {
//       console.error(`Error fetching Gemini API: ${error}`);
//       const errorMessage =
//         "Sorry, I encountered an error while processing your question. Would you like to try again or select another tool/step?";
//       setResponse(errorMessage);
//       setConversationHistory((prev) => [
//         ...prev,
//         { type: "artifly", text: errorMessage },
//       ]);
//       await speakResponse(errorMessage);

//       if (mode === "beginner") {
//         setSubMode("waiting_for_question");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle dashboard selection
//   const handleDashboardSelection = async () => {
//     setSelectedOption("dashboard");
//     setSubMode("waiting_for_tool_selection");
//     const prompt =
//       "You chose to explore platform tools. Please select a tool to learn about.";
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: prompt },
//     ]);
//     await speakResponse(prompt);
//   };

//   // Handle workflow selection
//   const handleWorkflowSelection = async () => {
//     setSelectedOption("workflow");
//     setSubMode("waiting_for_step_selection");
//     const prompt =
//       "You chose the artisan workflow. Please select the current step to begin.";
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: prompt },
//     ]);
//     await speakResponse(prompt);
//   };

//   // Handle tool selection
//   const handleToolSelection = async (tool: RouteConfig) => {
//     setSelectedTool({ ...tool });
//     const prompt = `You selected ${tool.name}. Now navigating to that page for more information.`;
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: prompt },
//     ]);
//     await speakResponse(prompt);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     navigate(tool.path, { replace: true, state: { fromArtiflyguide: true } });
//     setTargetRoute(tool.path);
//     setSubMode("explaining_tab");
//     setCurrentToolIndex(dashboardRoutes.findIndex((t) => t.path === tool.path));
//     lastProcessedRoute.current = tool.path;
//     await speakFieldsForRoute(tool.path);
//   };

//   // Handle step selection
//   const handleStepSelection = async (step: RouteConfig) => {
//     setSelectedTool({ ...step });
//     const prompt = `You selected ${step.name}. Now navigating to that page for more information.`;
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: prompt },
//     ]);
//     await speakResponse(prompt);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     navigate(step.path, { replace: true, state: { fromArtiflyguide: true } });
//     setTargetRoute(step.path);
//     setSubMode("explaining_tab");
//     setCurrentToolIndex(
//       artisanWorkflowSteps.findIndex((s) => s.path === step.path)
//     );
//     setCompletedSteps((prev) => {
//       const newSteps = [...prev, step.path];
//       localStorage.setItem("artisanProgress", JSON.stringify(newSteps));
//       return newSteps;
//     });
//     await speakFieldsForRoute(step.path);
//   };

//   // Proceed to next step
//   const proceedToNextStep = async () => {
//     setCompletedSteps((prev) => {
//       const newSteps = [...prev, artisanWorkflowSteps[currentToolIndex].path];
//       localStorage.setItem("artisanProgress", JSON.stringify(newSteps));
//       return newSteps;
//     });
//     const completionPrompt = `Step ${currentToolIndex + 1} completed!`;
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: completionPrompt },
//     ]);
//     await speakResponse(completionPrompt);

//     if (currentToolIndex < artisanWorkflowSteps.length - 1) {
//       const nextStep = artisanWorkflowSteps[currentToolIndex + 1];
//       const prompt = `Moving to ${nextStep.name}.`;
//       setConversationHistory((prev) => [
//         ...prev,
//         { type: "artifly", text: prompt },
//       ]);
//       await speakResponse(prompt);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       navigate(nextStep.path, {
//         replace: true,
//         state: { fromArtiflyguide: true },
//       });
//       setTargetRoute(nextStep.path);
//       setSubMode("explaining_tab");
//       setCurrentToolIndex(currentToolIndex + 1);
//       lastProcessedRoute.current = nextStep.path;
//       await speakFieldsForRoute(nextStep.path);
//     } else {
//       const prompt =
//         "You've reached the end of the artisan workflow. Click 'End Process' to complete or explore other options.";
//       setConversationHistory((prev) => [
//         ...prev,
//         { type: "artifly", text: prompt },
//       ]);
//       await speakResponse(prompt);
//       setSubMode("tour_complete");
//     }
//   };

//   // End process
//   const endProcess = async () => {
//     const congratsPrompt =
//       "Congratulations! You've successfully completed the artisan workflow! Would you like to restart the process or explore platform tools?";
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: congratsPrompt },
//     ]);
//     await speakResponse(congratsPrompt);
//     setSubMode("process_ended");
//     setCurrentToolIndex(0);
//     setCompletedSteps([]);
//     localStorage.setItem("artisanProgress", JSON.stringify([]));
//   };

//   // Restart process
//   const restartProcess = async () => {
//     setCompletedSteps([]);
//     localStorage.setItem("artisanProgress", JSON.stringify([]));
//     const routes =
//       selectedOption === "workflow" ? artisanWorkflowSteps : dashboardRoutes;
//     const prompt = `Starting over with ${routes[0].name}.`;
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: prompt },
//     ]);
//     await speakResponse(prompt);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     navigate(routes[0].path, {
//       replace: true,
//       state: { fromArtiflyguide: true },
//     });
//     setTargetRoute(routes[0].path);
//     setSubMode("explaining_tab");
//     setCurrentToolIndex(0);
//     lastProcessedRoute.current = routes[0].path;
//     await speakFieldsForRoute(routes[0].path);
//   };

//   // Speak fields for route
//   const speakFieldsForRoute = async (route: string) => {
//     const normalizedRoute = normalizePath(route);
//     const foundRoute =
//       dashboardRoutes.find((r) => normalizePath(r.path) === normalizedRoute) ||
//       artisanWorkflowSteps.find(
//         (s) => normalizePath(s.path) === normalizedRoute
//       );

//     if (!foundRoute) {
//       const message =
//         "It seems you're on an unrecognized page. Let's return to the dashboard home.";
//       setConversationHistory((prev) => [
//         ...prev,
//         { type: "artifly", text: message },
//       ]);
//       await speakResponse(message);
//       navigate("/dashboard", {
//         replace: true,
//         state: { fromArtiflyguide: true },
//       });
//       lastProcessedRoute.current = "/dashboard";
//       return;
//     }

//     const fullMessage = `Now at ${foundRoute.name}. ${
//       foundRoute.details || foundRoute.description
//     }`;
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: fullMessage },
//     ]);
//     await speakResponse(fullMessage);

//     if (mode === "beginner") {
//       setSubMode("waiting_for_question");
//       const questionPrompt =
//         "Do you have any questions about this tool? If not, you can select another step or proceed to the next step.";
//       setConversationHistory((prev) => [
//         ...prev,
//         { type: "artifly", text: questionPrompt },
//       ]);
//       await speakResponse(questionPrompt);
//     }
//   };

//   // Reset to initial selection
//   const resetToInitialSelection = async () => {
//     const prompt =
//       "Returning to the initial selection screen. How can I help you today?";
//     setConversationHistory((prev) => [
//       ...prev,
//       { type: "artifly", text: prompt },
//     ]);
//     await speakResponse(prompt);
//     setMode(null);
//     setSubMode(null);
//     setSelectedOption(null);
//     setTargetRoute(null);
//     setSelectedTool(null);
//     setCurrentToolIndex(0);
//     setCompletedSteps([]);
//     localStorage.setItem("artisanProgress", JSON.stringify([]));
//   };

//   // Scroll to bottom
//   useEffect(() => {
//     if (conversationRef.current) {
//       conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
//     }
//   }, [conversationHistory]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isCleaningUp.current = true;
//       window.speechSynthesis.cancel();
//       if (recognitionRef.current) {
//         try {
//           recognitionRef.current.stop();
//         } catch (error) {
//           console.error(`Error stopping recognition: ${error}`);
//         }
//       }
//       recognitionRef.current = null;
//     };
//   }, []);

//   // Save progress
//   useEffect(() => {
//     localStorage.setItem("artisanProgress", JSON.stringify(completedSteps));
//   }, [completedSteps]);

//   return (
//     <div className="font-sans">
//       {/* Trigger Button */}
//       <button
//         onClick={() => setIsPanelOpen(true)}
//         disabled={isPanelOpen}
//         onMouseEnter={() => setTooltipVisible("trigger")}
//         onMouseLeave={() => setTooltipVisible("")}
//         aria-label={
//           isPanelOpen ? "Close Artifly Assistant" : "Open Artifly Assistant"
//         }
//         className={`fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50 group ${
//           isPanelOpen
//             ? "bg-black hover:shadow-black/50 border-2 border-white"
//             : "bg-black hover:shadow-black/50 animate-pulse border-2 border-white"
//         }`}
//       >
//         <Bot className="h-7 w-7 text-white transition-transform duration-300 group-hover:rotate-12" />
//       </button>

//       {/* Pointing Message */}
//       {!isPanelOpen && (
//         <div className="fixed bottom-24 right-6 z-40 animate-bounce">
//           <div className="relative bg-white backdrop-blur-sm rounded-2xl shadow-2xl p-4 mb-2 border-2 border-black">
//             <div className="absolute right-6 bottom-0 transform translate-y-full w-4 h-4 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
//             <div className="flex items-center space-x-3">
//               <div className="bg-black p-2 rounded-full">
//                 <Bot className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <div className="text-base font-bold text-black">
//                   Artifly AI Assistant
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Your artisan marketing companion
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Side Panel */}
//       {isPanelOpen && (
//         <div className="fixed top-16 right-4 h-[92vh] w-[32rem] bg-white backdrop-blur-xl shadow-2xl z-50 flex flex-col border-2 border-black rounded-2xl">
//           {/* Header */}
//           <div className="flex items-center justify-between p-5 border-b-2 border-black bg-black text-white rounded-t-2xl">
//             <div className="flex items-center space-x-3">
//               {mode && (
//                 <button
//                   onClick={resetToInitialSelection}
//                   aria-label="Back to initial selection"
//                   className="rounded-full h-10 w-10 bg-white hover:bg-gray-200 text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white"
//                 >
//                   <ArrowLeft className="h-5 w-5" />
//                 </button>
//               )}
//               <div className="bg-white p-2 rounded-full">
//                 <Bot className="h-7 w-7 text-black" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold">ARTIFLY</h2>
//                 <div className="text-xs text-gray-300">
//                   AI Marketing Assistant
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => {
//                   const helpPrompt =
//                     "In beginner mode, you can type questions or follow guided steps. In voice mode, use voice input to ask questions. Use the buttons to navigate or say 'stop' to end the conversation.";
//                   setConversationHistory((prev) => [
//                     ...prev,
//                     { type: "artifly", text: helpPrompt },
//                   ]);
//                   speakResponse(helpPrompt);
//                 }}
//                 aria-label="Help"
//                 className="rounded-full h-10 w-10 bg-white hover:bg-gray-200 text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white"
//               >
//                 <HelpCircle className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={stopConversation}
//                 aria-label="Close panel"
//                 className="rounded-full h-10 w-10 bg-white hover:bg-gray-200 text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-col h-full overflow-hidden">
//             {/* Welcome Screen */}
//             {!mode && (
//               <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6 overflow-y-auto bg-gray-50">
//                 <div className="text-center">
//                   <div className="bg-black p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-black">
//                     <Bot className="h-10 w-10 text-white" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-black mb-3">
//                     Welcome to Artifly
//                   </h3>
//                   <p className="text-base text-gray-600 leading-relaxed mb-2">
//                     Choose an option to start your artisan marketing journey.
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Please be clear & loud enough in conversation
//                   </p>
//                 </div>

//                 <div className="w-full space-y-4 max-w-sm">
//                   <button
//                     onClick={() => startConversation("doubt")}
//                     className="w-full py-4 px-6 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 text-base font-semibold shadow-2xl transform hover:scale-105 border-2 border-black"
//                     aria-label="Ask a question"
//                   >
//                     <div className="flex items-center justify-center space-x-3">
//                       <Mic className="h-6 w-6" />
//                       <span>Voice Questions</span>
//                       <Zap className="h-5 w-5" />
//                     </div>
//                   </button>
//                 </div>

//                 <div className="w-full pt-6 border-t-2 border-gray-300 max-w-sm">
//                   <h4 className="text-sm font-medium text-gray-600 mb-4 text-center">
//                     Note
//                   </h4>
//                   <p className="text-center text-sm text-gray-600">
//                     Speak your question louder and clearly. Works best on Chrome
//                     & Edge browsers.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {mode && (
//               <div className="flex flex-col h-full overflow-hidden">
//                 {/* Progress Header */}
//                 {mode === "beginner" &&
//                   selectedOption === "workflow" &&
//                   subMode !== "waiting_for_selection" &&
//                   subMode !== "waiting_for_step_selection" &&
//                   subMode !== "process_ended" && (
//                     <div className="p-4 bg-gray-100 border-b-2 border-black flex-shrink-0">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-base font-bold text-black">
//                           Artisan Workflow
//                         </h3>
//                         <div className="text-sm text-gray-600 font-mono">
//                           Step {currentToolIndex + 1} of{" "}
//                           {artisanWorkflowSteps.length}
//                         </div>
//                       </div>
//                       <div className="w-full bg-gray-300 border-2 border-black rounded-full h-3 overflow-hidden">
//                         <div
//                           className="bg-black h-3 rounded-full transition-all duration-700"
//                           style={{
//                             width: `${
//                               ((currentToolIndex + 1) /
//                                 artisanWorkflowSteps.length) *
//                               100
//                             }%`,
//                           }}
//                         ></div>
//                       </div>
//                       <div className="flex items-center space-x-2 overflow-x-auto pb-2 mt-3">
//                         {artisanWorkflowSteps.map((step, index) => (
//                           <div
//                             key={index}
//                             className={`flex-shrink-0 flex items-center transition-all duration-300 ${
//                               completedSteps.includes(step.path)
//                                 ? "text-green-600"
//                                 : index === currentToolIndex
//                                 ? "text-black"
//                                 : "text-gray-400"
//                             }`}
//                           >
//                             <div
//                               className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
//                                 completedSteps.includes(step.path)
//                                   ? "bg-green-100 border-2 border-green-600"
//                                   : index === currentToolIndex
//                                   ? "bg-gray-200 border-2 border-black"
//                                   : "bg-gray-100 border-2 border-gray-300"
//                               }`}
//                             >
//                               {completedSteps.includes(step.path) ? (
//                                 <CheckCircle className="h-4 w-4" />
//                               ) : (
//                                 <span>{index + 1}</span>
//                               )}
//                             </div>
//                             {index < artisanWorkflowSteps.length - 1 && (
//                               <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                 {/* Current Step Details */}
//                 {mode === "beginner" &&
//                   selectedOption === "workflow" &&
//                   subMode !== "waiting_for_selection" &&
//                   subMode !== "waiting_for_step_selection" &&
//                   subMode !== "process_ended" && (
//                     <div className="p-4 bg-white border-b-2 border-black flex-shrink-0">
//                       <div className="flex items-start space-x-4">
//                         <div className="bg-black p-3 rounded-xl border-2 border-black text-white">
//                           {
//                             iconMap[
//                               artisanWorkflowSteps[currentToolIndex]?.icon
//                             ]
//                           }
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <h4 className="text-lg font-bold text-black truncate mb-1">
//                             {artisanWorkflowSteps[currentToolIndex]?.name}
//                           </h4>
//                           <p className="text-sm text-gray-600 line-clamp-2">
//                             {
//                               artisanWorkflowSteps[currentToolIndex]
//                                 ?.description
//                             }
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                 {/* Navigation Buttons */}
//                 {mode === "beginner" &&
//                   selectedOption === "workflow" &&
//                   subMode !== "waiting_for_selection" &&
//                   subMode !== "waiting_for_step_selection" &&
//                   subMode !== "process_ended" && (
//                     <div className="flex justify-between p-4 bg-gray-50 border-b-2 border-black flex-shrink-0">
//                       <button
//                         disabled={true}
//                         className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed bg-gray-200 border-2 border-gray-300"
//                         aria-label="Previous step (disabled)"
//                       >
//                         <ChevronLeft className="h-4 w-4" />
//                         <span>Previous</span>
//                       </button>
//                       {currentToolIndex === artisanWorkflowSteps.length - 1 ? (
//                         <button
//                           onClick={endProcess}
//                           disabled={isSpeaking}
//                           className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
//                             isSpeaking
//                               ? "text-gray-400 cursor-not-allowed bg-gray-200 border-2 border-gray-300"
//                               : "text-white bg-green-600 hover:bg-green-700 transform hover:scale-105 shadow-lg border-2 border-green-600"
//                           }`}
//                           aria-label="End workflow"
//                         >
//                           <span>Complete</span>
//                           <Sparkles className="h-4 w-4" />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={proceedToNextStep}
//                           disabled={isSpeaking}
//                           className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
//                             isSpeaking
//                               ? "text-gray-400 cursor-not-allowed bg-gray-200 border-2 border-gray-300"
//                               : "text-white bg-black hover:bg-gray-800 transform hover:scale-105 shadow-lg border-2 border-black"
//                           }`}
//                           aria-label="Next step"
//                         >
//                           <span>Next</span>
//                           <ChevronRight className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>
//                   )}

//                 {/* Selection Screens */}
//                 {mode === "beginner" && subMode === "waiting_for_selection" && (
//                   <div className="p-5 flex-shrink-0 overflow-y-auto bg-gray-50">
//                     <h3 className="text-lg font-bold text-black mb-4">
//                       Select an option to continue:
//                     </h3>
//                     <div className="grid grid-cols-1 gap-4">
//                       <button
//                         onClick={() => handleDashboardSelection()}
//                         className="flex items-center space-x-4 p-4 bg-white rounded-2xl border-2 border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
//                         aria-label="Explore platform tools"
//                       >
//                         <div className="bg-black p-3 rounded-xl border-2 border-black text-white">
//                           {iconMap["Home"]}
//                         </div>
//                         <div className="text-left min-w-0 flex-1">
//                           <div className="text-base font-bold text-black">
//                             Platform Tools
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Explore all available tools and features
//                           </div>
//                         </div>
//                       </button>
//                       <button
//                         onClick={() => handleWorkflowSelection()}
//                         className="flex items-center space-x-4 p-4 bg-white rounded-2xl border-2 border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
//                       >
//                         <div className="bg-black p-3 rounded-xl border-2 border-black text-white">
//                           {iconMap["Sparkles"]}
//                         </div>
//                         <div className="text-left min-w-0 flex-1">
//                           <div className="text-base font-bold text-black">
//                             Artisan Workflow
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Guided step-by-step marketing journey
//                           </div>
//                         </div>
//                       </button>
//                     </div>
//                     <div className="flex justify-between gap-3 mt-6">
//                       <button
//                         onClick={() => {
//                           stopConversation();
//                           setIsPanelOpen(false);
//                         }}
//                         className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-red-600"
//                         aria-label="End conversation"
//                       >
//                         End Conversation
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Tool Selection */}
//                 {mode === "beginner" &&
//                   subMode === "waiting_for_tool_selection" && (
//                     <div className="p-5 bg-gray-50 border-b-2 border-black flex-shrink-0 overflow-y-auto max-h-72">
//                       <h3 className="text-lg font-bold text-black mb-4">
//                         Select a tool to explore:
//                       </h3>
//                       <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pb-2 space-y-2">
//                         {dashboardRoutes.map((tool, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleToolSelection(tool)}
//                             className="flex items-center space-x-4 p-4 bg-white rounded-xl border-2 border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg group"
//                             aria-label={`Select ${tool.name} tool`}
//                             title={tool.description}
//                           >
//                             <div className="bg-black p-2 rounded-lg border-2 border-black text-white transition-all duration-300">
//                               {iconMap[tool.icon]}
//                             </div>
//                             <div className="text-left min-w-0 flex-1">
//                               <div className="text-sm font-bold truncate text-black">
//                                 {tool.name}
//                               </div>
//                               <div className="text-xs text-gray-600 line-clamp-1">
//                                 {tool.description}
//                               </div>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                       <div className="flex justify-between gap-3 mt-4">
//                         <button
//                           onClick={async () => {
//                             const prompt = "Returning to option selection.";
//                             setConversationHistory((prev) => [
//                               ...prev,
//                               { type: "artifly", text: prompt },
//                             ]);
//                             await speakResponse(prompt);
//                             setSubMode("waiting_for_selection");
//                             setSelectedOption(null);
//                           }}
//                           className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-black"
//                           aria-label="Go back"
//                         >
//                           Back
//                         </button>
//                         <button
//                           onClick={() => {
//                             stopConversation();
//                             setIsPanelOpen(false);
//                           }}
//                           className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-red-600"
//                           aria-label="End conversation"
//                         >
//                           End Conversation
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                 {/* Step Selection */}
//                 {mode === "beginner" &&
//                   subMode === "waiting_for_step_selection" && (
//                     <div className="p-5 bg-gray-50 border-b-2 border-black flex-shrink-0 overflow-y-auto max-h-96">
//                       <h3 className="text-lg font-bold text-black mb-4">
//                         Select a step to explore:
//                       </h3>
//                       <div className="grid grid-cols-1 gap-3">
//                         {artisanWorkflowSteps.map((step, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleStepSelection(step)}
//                             disabled={
//                               index !== currentToolIndex ||
//                               completedSteps.includes(step.path)
//                             }
//                             className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 transform ${
//                               index !== currentToolIndex ||
//                               completedSteps.includes(step.path)
//                                 ? "bg-gray-200 border-gray-300 opacity-50 cursor-not-allowed"
//                                 : "bg-white border-black hover:bg-gray-50 hover:scale-105 shadow-lg group"
//                             }`}
//                             aria-label={`${
//                               index !== currentToolIndex ||
//                               completedSteps.includes(step.path)
//                                 ? `${step.name} (locked)`
//                                 : `Select ${step.name}`
//                             }`}
//                             title={step.description}
//                           >
//                             <div
//                               className={`p-2 rounded-lg border-2 transition-all duration-300 ${
//                                 completedSteps.includes(step.path)
//                                   ? "bg-green-100 border-green-600"
//                                   : index === currentToolIndex
//                                   ? "bg-black border-black text-white"
//                                   : "bg-gray-200 border-gray-300"
//                               }`}
//                             >
//                               {completedSteps.includes(step.path) ? (
//                                 <CheckCircle className="h-4 w-4 text-green-600" />
//                               ) : (
//                                 <div>{iconMap[step.icon]}</div>
//                               )}
//                             </div>
//                             <div className="text-left min-w-0 flex-1">
//                               <div className="text-sm font-bold truncate text-black">
//                                 {step.name}
//                               </div>
//                               <div className="text-xs text-gray-600 line-clamp-2">
//                                 {step.description}
//                               </div>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                       <div className="flex justify-between gap-3 mt-4">
//                         <button
//                           onClick={async () => {
//                             const prompt = "Returning to option selection.";
//                             setConversationHistory((prev) => [
//                               ...prev,
//                               { type: "artifly", text: prompt },
//                             ]);
//                             await speakResponse(prompt);
//                             setSubMode("waiting_for_selection");
//                             setSelectedOption(null);
//                           }}
//                           className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-black"
//                           aria-label="Go back"
//                         >
//                           Back
//                         </button>
//                         <button
//                           onClick={() => {
//                             stopConversation();
//                             setIsPanelOpen(false);
//                           }}
//                           className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-red-600"
//                           aria-label="End conversation"
//                         >
//                           End Conversation
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                 {/* Process Ended */}
//                 {mode === "beginner" && subMode === "process_ended" && (
//                   <div className="p-5 bg-green-50 border-b-2 border-green-600 flex-shrink-0 overflow-y-auto">
//                     <div className="text-center mb-4">
//                       <div className="bg-green-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-3 flex items-center justify-center border-2 border-green-600">
//                         <Sparkles className="h-8 w-8 text-white" />
//                       </div>
//                       <h3 className="text-xl font-bold text-green-600 mb-2">
//                         Process Completed!
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         Congratulations on completing the artisan workflow
//                       </p>
//                     </div>
//                     <div className="grid grid-cols-1 gap-3">
//                       <button
//                         onClick={() => restartProcess()}
//                         className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
//                         aria-label="Restart workflow"
//                       >
//                         <div className="bg-black p-2 rounded-lg border-2 border-black text-white">
//                           {iconMap["Sparkles"]}
//                         </div>
//                         <div className="text-left min-w-0 flex-1">
//                           <div className="text-sm font-bold text-black">
//                             Restart Workflow
//                           </div>
//                           <div className="text-xs text-gray-600">
//                             Start the process again from the beginning
//                           </div>
//                         </div>
//                       </button>
//                       <button
//                         onClick={() => handleDashboardSelection()}
//                         className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
//                         aria-label="Explore platform tools"
//                       >
//                         <div className="bg-black p-2 rounded-lg border-2 border-black text-white">
//                           {iconMap["Home"]}
//                         </div>
//                         <div className="text-left min-w-0 flex-1">
//                           <div className="text-sm font-bold text-black">
//                             Explore Platform Tools
//                           </div>
//                           <div className="text-xs text-gray-600">
//                             Try other available tools and features
//                           </div>
//                         </div>
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSubMode("waiting_for_selection");
//                           const prompt = "Returning to option selection.";
//                           setConversationHistory((prev) => [
//                             ...prev,
//                             { type: "artifly", text: prompt },
//                           ]);
//                           speakResponse(prompt);
//                         }}
//                         className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
//                         aria-label="Return to options"
//                       >
//                         <div className="bg-black p-2 rounded-lg border-2 border-black text-white">
//                           {iconMap["Bot"]}
//                         </div>
//                         <div className="text-left min-w-0 flex-1">
//                           <div className="text-sm font-bold text-black">
//                             Back to Options
//                           </div>
//                           <div className="text-xs text-gray-600">
//                             Choose between platform or workflow
//                           </div>
//                         </div>
//                       </button>
//                     </div>
//                     <div className="flex justify-between gap-3 mt-4">
//                       <button
//                         onClick={() => {
//                           stopConversation();
//                           setIsPanelOpen(false);
//                         }}
//                         className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-red-600"
//                         aria-label="End conversation"
//                       >
//                         End Conversation
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Conversation History */}
//                 <div
//                   ref={conversationRef}
//                   className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[200px] max-h-[50vh] bg-gray-50"
//                 >
//                   {conversationHistory.map((msg, index) => (
//                     <div
//                       key={index}
//                       className={`flex ${
//                         msg.type === "user" ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-[85%] ${
//                           msg.type === "user"
//                             ? "bg-black text-white rounded-tr-none shadow-lg border-2 border-black"
//                             : "bg-white text-black rounded-tl-none border-2 border-gray-300 shadow-lg"
//                         } rounded-2xl px-5 py-4 mb-2 transition-all duration-300 hover:shadow-xl`}
//                       >
//                         {msg.type === "artifly" && (
//                           <div className="flex items-center space-x-2 mb-2 pb-2 border-b-2 border-gray-300">
//                             <Bot className="h-4 w-4 text-black" />
//                             <span className="text-xs font-bold text-black">
//                               ARTIFLY AI
//                             </span>
//                             <div className="flex space-x-1">
//                               <div className="w-1 h-1 bg-black rounded-full animate-pulse"></div>
//                               <div
//                                 className="w-1 h-1 bg-black rounded-full animate-pulse"
//                                 style={{ animationDelay: "0.2s" }}
//                               ></div>
//                               <div
//                                 className="w-1 h-1 bg-black rounded-full animate-pulse"
//                                 style={{ animationDelay: "0.4s" }}
//                               ></div>
//                             </div>
//                           </div>
//                         )}
//                         <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
//                           {msg.text}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   {(isLoading || isSpeaking) && (
//                     <div className="flex justify-start">
//                       <div className="max-w-[85%] w-full py-4 px-5 bg-white border-2 border-gray-300 rounded-2xl shadow-lg">
//                         <div className="flex items-center space-x-2 pb-2 border-b-2 border-gray-300 mb-3">
//                           <Bot className="h-4 w-4 text-black animate-pulse" />
//                           <span className="text-xs font-bold text-black">
//                             ARTIFLY AI
//                           </span>
//                           <div className="text-xs text-gray-600">
//                             Processing...
//                           </div>
//                         </div>
//                         <div className="flex space-x-2 items-center">
//                           <div className="h-3 w-2 bg-black rounded-full animate-bounce"></div>
//                           <div
//                             className="h-4 w-2 bg-black rounded-full animate-bounce"
//                             style={{ animationDelay: "0.1s" }}
//                           ></div>
//                           <div
//                             className="h-5 w-2 bg-black rounded-full animate-bounce"
//                             style={{ animationDelay: "0.2s" }}
//                           ></div>
//                           <div
//                             className="h-4 w-2 bg-black rounded-full animate-bounce"
//                             style={{ animationDelay: "0.3s" }}
//                           ></div>
//                           <div
//                             className="h-3 w-2 bg-black rounded-full animate-bounce"
//                             style={{ animationDelay: "0.4s" }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Status Bar */}
//                 {mode && (
//                   <div className="px-5 py-3 mt-2 bg-gray-100 border-t-2 border-black flex-shrink-0">
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center space-x-3">
//                         <div
//                           className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                             isListening
//                               ? "bg-green-500 animate-pulse shadow-lg"
//                               : isSpeaking
//                               ? "bg-black animate-pulse shadow-lg"
//                               : "bg-gray-400"
//                           }`}
//                         ></div>
//                         <span
//                           className={`font-medium ${
//                             isListening
//                               ? "text-green-600"
//                               : isSpeaking
//                               ? "text-black"
//                               : "text-gray-500"
//                           }`}
//                         >
//                           {isListening
//                             ? "Listening..."
//                             : isSpeaking
//                             ? "Speaking..."
//                             : "Ready"}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-2 text-gray-600">
//                         <span className="text-xs">
//                           {conversationHistory.length} messages
//                         </span>
//                         {mode === "doubt" && (
//                           <div className="flex items-center space-x-1">
//                             <Mic className="h-3 w-3" />
//                             <span className="text-xs">Voice Mode</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Input Area */}
//                 <div className="p-5 border-t-2 border-black flex-shrink-0 bg-white">
//                   {mode === "doubt" && (
//                     <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-100 border-2 border-black shadow-lg">
//                       <div className="flex items-center space-x-3 text-sm">
//                         {isListening && mode === "doubt" ? (
//                           <>
//                             <div className="relative">
//                               <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
//                               <Mic className="h-6 w-6 text-green-600 animate-pulse" />
//                             </div>
//                             <div>
//                               <span className="text-base font-bold text-green-600">
//                                 Listening...
//                               </span>
//                               <div className="text-xs text-gray-600">
//                                 Speak your question now
//                               </div>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <MicOff className="h-6 w-6 text-red-600 animate-pulse" />
//                             <div>
//                               <span className="text-base font-bold text-red-600">
//                                 Voice Paused
//                               </span>
//                               <div className="text-xs text-gray-600">
//                                 Click Start to begin
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                       <button
//                         onClick={() =>
//                           isListening
//                             ? stopConversation()
//                             : startConversation("doubt")
//                         }
//                         className={`flex items-center px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
//                           isListening
//                             ? "bg-red-600 hover:bg-red-700 border-red-600"
//                             : "bg-green-600 hover:bg-green-700 border-green-600"
//                         }`}
//                         aria-label="Start or stop voice conversation"
//                       >
//                         {isListening ? "Stop" : "Start"}
//                       </button>
//                     </div>
//                   )}
//                   {mode === "beginner" &&
//                     subMode === "waiting_for_question" && (
//                       <div className="flex flex-col space-y-4">
//                         <input
//                           type="text"
//                           placeholder="Ask a question about this tool..."
//                           className="w-full px-5 py-3 rounded-2xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-black placeholder-gray-500 transition-all duration-300"
//                           onKeyDown={async (e) => {
//                             if (
//                               e.key === "Enter" &&
//                               (e.target as HTMLInputElement).value.trim()
//                             ) {
//                               setSubMode("resolving_doubt");
//                               const query = (
//                                 e.target as HTMLInputElement
//                               ).value.trim();
//                               setConversationHistory((prev) => [
//                                 ...prev,
//                                 { type: "user", text: query },
//                               ]);
//                               await fetchResponse(query);
//                               (e.target as HTMLInputElement).value = "";
//                             }
//                           }}
//                           aria-label="Ask a question about this tool"
//                         />
//                         {suggestedQuestions[targetRoute || ""]?.length && (
//                           <div className="flex flex-wrap gap-2">
//                             {suggestedQuestions[targetRoute || ""].map(
//                               (q, index) => (
//                                 <button
//                                   key={index}
//                                   onClick={() => {
//                                     setSubMode("resolving_doubt");
//                                     setConversationHistory((prev) => [
//                                       ...prev,
//                                       { type: "user", text: q },
//                                     ]);
//                                     fetchResponse(q);
//                                   }}
//                                   className="px-4 py-2 bg-gray-200 text-black rounded-xl text-xs hover:bg-gray-300 transition-all duration-300 border-2 border-gray-300 transform hover:scale-105"
//                                   aria-label={`Ask suggested question: ${q}`}
//                                   title={`Ask suggested question: ${q}`}
//                                 >
//                                   {q}
//                                 </button>
//                               )
//                             )}
//                           </div>
//                         )}
//                         <div className="flex justify-end gap-3">
//                           {selectedOption === "workflow" && (
//                             <button
//                               onClick={() => proceedToNextStep()}
//                               disabled={isSpeaking}
//                               className="flex-1 px-5 py-3 rounded-xl bg-black text-sm font-semibold text-white hover:bg-gray-800 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-black"
//                               aria-label="Proceed to next step"
//                             >
//                               Next Step
//                             </button>
//                           )}
//                           <button
//                             onClick={async () => {
//                               const prompt = `Returning to ${
//                                 selectedOption === "workflow" ? "step" : "tool"
//                               } selection.`;
//                               setConversationHistory((prev) => [
//                                 ...prev,
//                                 { type: "artifly", text: prompt },
//                               ]);
//                               await speakResponse(prompt);
//                               setSubMode(
//                                 selectedOption === "workflow"
//                                   ? "waiting_for_step_selection"
//                                   : "waiting_for_tool_selection"
//                               );
//                             }}
//                             disabled={isSpeaking}
//                             className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-gray-600"
//                             aria-label={`Select another ${
//                               selectedOption === "workflow" ? "step" : "tool"
//                             }`}
//                           >
//                             Select Another{" "}
//                             {selectedOption === "workflow" ? "Step" : "Tool"}
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                   {/* Help Text */}
//                   <div className="mt-4 py-3 px-5 bg-gray-100 rounded-xl border-2 border-gray-300">
//                     <div className="text-xs text-center text-gray-600 leading-relaxed flex items-center justify-center space-x-2">
//                       <Sparkles className="h-4 w-4 text-black" />
//                       <span>
//                         Artifly specializes in artisan marketing, storytelling,
//                         and digital promotion
//                       </span>
//                       <Zap className="h-4 w-4 text-black" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Add custom animations */}
//       <style>{`
//         @keyframes bounce-subtle {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }
//         .animate-bounce-subtle {
//           animation: bounce-subtle 2s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }