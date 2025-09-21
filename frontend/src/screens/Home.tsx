import {
  Sparkles,
  Upload,
  Mic,
  BarChart3,
  Heart,
  Users,
  Zap,
  Mail,
  Palette,
  HandMetal,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { RiShoppingBag4Line } from "react-icons/ri";
import { createProduct } from "./Dashboard";

export default function HomePage() {
  const navigate = useNavigate();

  // Sample artisan data - in a real app, this would come from your API
  const artisans = [
    {
      name: "Emma Thompson",
      categories: ["Pottery", "Ceramics", "Home Decor"],
      email: "emma.pottery@email.com",
      location: "Portland, OR",
      avatar: "ET",
    },
    {
      name: "Carlos Martinez",
      categories: ["Woodworking", "Furniture", "Sculptures"],
      email: "carlos.wood@email.com",
      location: "Austin, TX",
      avatar: "CM",
    },
    {
      name: "Aisha Patel",
      categories: ["Textiles", "Embroidery", "Fashion"],
      email: "aisha.textiles@email.com",
      location: "San Francisco, CA",
      avatar: "AP",
    },
    {
      name: "Miguel Santos",
      categories: ["Jewelry", "Metalwork", "Accessories"],
      email: "miguel.jewelry@email.com",
      location: "Miami, FL",
      avatar: "MS",
    },
    {
      name: "Sarah Chen",
      categories: ["Painting", "Digital Art", "Prints"],
      email: "sarah.art@email.com",
      location: "Seattle, WA",
      avatar: "SC",
    },
    {
      name: "David Kumar",
      categories: ["Leather Goods", "Bags", "Accessories"],
      email: "david.leather@email.com",
      location: "Denver, CO",
      avatar: "DK",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}

      <section className="relative h-[calc(100vh-64px)] flex items-center justify-center pt-10 md:pb-10 bg-gradient-to-b from-background via-muted to-background">
        {/* Decorative background gradient/pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-2xl opacity-30" />
          <img
            src="platebg.svg"
            alt=""
            className="relative right-60 bottom-40 "
          />
        </div>

        {/* Content */}
        <div className="flex items-center justify-between 2xl:gap-20">
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-foreground leading-tight mb-6 animate-fadeIn font-epunda! tracking-wide">
              Empowering Local Artisans with AI
            </h1>
            <p className="text-xl md:text-2xl 2xl:text-[28px] px-4 text-muted-foreground mb-10 leading-relaxed animate-fadeIn [animation-delay:200ms]">
              Transform your craft into compelling stories. Upload your
              creations, let AI help you describe them beautifully, and connect
              with customers who value handmade artistry.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fadeIn [animation-delay:400ms]">
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="px-10 py-3 2xl:py-4 text-xl xl:text-2xl! rounded-2xl bg-accent! shadow-lg hover:scale-105 transition"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Selling Your Craft
              </Button>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10  py-[11px] 2xl:py-[15px] text-xl xl:text-2xl! rounded-2xl bg-background! border-1 border-orange-800! hover:bg-muted/50 hover:scale-105 transition"
                >
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          <img
            src="pottery.svg"
            alt=""
            height={330}
            width={330}
            className="hidden md:block relative left-10 2xl:left-30 2xl:scale-130"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl 2xl:text-6xl font-epunda! font-bold text-foreground mb-4">
              Simple Tools for Artisan Success
            </h2>
            <p className="text-2xl xl:text-2xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              We've designed every feature with artisans in mind - simple,
              intuitive, and powerful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Smart Photo Upload
                </h3>
                <p className="text-lg text-muted-foreground">
                  Simply upload your craft photos and our AI automatically
                  suggests categories, tags, and optimizations to make your
                  products shine.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Mic className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Voice Storytelling
                </h3>
                <p className="text-lg text-muted-foreground">
                  Tell your craft's story in your own words. Our AI transforms
                  your voice into compelling product descriptions that connect
                  with customers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Growth Insights
                </h3>
                <p className="text-lg text-muted-foreground">
                  Track which products resonate most with customers and get
                  AI-powered suggestions to improve your craft marketing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Artisan Collaboration Section */}
      <section
        id="artisan-collaboration"
        className="py-20 bg-gradient-to-b from-background to-muted/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <HandMetal className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl 2xl:text-6xl font-epunda! font-bold text-foreground mb-4">
              Artisans with same interests you can start collaborating with!
            </h2>
            <p className="text-xl xl:text-2xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              Connect with fellow artisans, share techniques, collaborate on
              projects, and grow together in the creative community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((artisan, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {artisan.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {artisan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {artisan.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Palette className="h-4 w-4 text-secondary mr-2" />
                      <span className="text-sm font-medium text-foreground">
                        Specializes in:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {artisan.categories.map((category, catIndex) => (
                        <span
                          key={catIndex}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-muted">
                    <Button
                      variant="outline"
                      className="w-full text-sm hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200"
                      onClick={() =>
                        window.open(
                          `mailto:${artisan.email}?subject=Collaboration Inquiry from ARTIFLY`
                        )
                      }
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Connect for Collaboration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg rounded-2xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <Users className="h-5 w-5 mr-2" />
              View All Artisans
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="pt-30 py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl 2xl:text-5xl font-epunda! md:text-[40px] font-bold text-foreground mb-4">
              From craft to customer in minutes, not hours.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <IoCloudUploadOutline size={40} />,
                color: "bg-primary",
                title: "Upload & Describe",
                desc: "Upload photos of your craft and tell us about your creation process, materials, and inspiration.",
              },
              {
                icon: <BsStars size={40} />,
                color: "bg-secondary",
                title: "AI Enhancement",
                desc: "Our AI creates compelling product stories, suggests optimal pricing, and generates SEO-friendly descriptions.",
              },
              {
                icon: <RiShoppingBag4Line size={40} />,
                color: "bg-accent",
                title: "Connect & Sell",
                desc: "Your beautifully presented crafts reach customers who appreciate handmade artistry and authentic stories.",
              },
            ].map(({ icon, color, title, desc }) => (
              <div key={color} className="text-center space-y-4">
                <div
                  className={`mx-auto w-20 h-20 ${color} rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {icon}
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-lg text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 pb-30 pt-0 bg-muted z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card p-8 rounded-2xl shadow-lg border">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className="h-5 w-5 text-primary fill-current"
                  />
                ))}
              </div>
            </div>
            <blockquote className="text-xl text-foreground mb-6">
              "ARTIFLY helped me turn my pottery hobby into a thriving business.
              The AI understood my story and helped me express what makes each
              piece special. My sales increased by 300% in just two months!"
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Maria Rodriguez</p>
                <p className="text-sm text-muted-foreground">
                  Ceramic Artist, Santa Fe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-20 bg-primary text-primary-foreground relative overflow-clip"
      >
        <div className="flex items-center flex-col justify-center mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="max-w-xl text-3xl leading-16 md:text-5xl font-epunda! font-bold mb-6">
            Ready to Share Your Craft with the World?
          </h2>
          <p className="text-xl xl:text-2xl max-w-xl leading-8 mb-8 opacity-90">
            Join thousands of artisans who've transformed their passion into
            profit with AI-powered storytelling.
          </p>
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              createProduct();
              navigate("/onboarding");
            }}
            className="text-xl 2xl:text-2xl! mt-8 bg-accent-foreground! px-8 py-6 hover:px-10 hover:border-accent transition-all duration-300"
          >
            <Zap className="h-5 w-5 mr-2" />
            Get Started Free
          </Button>
        </div>
        <img
          src="platebg.svg"
          alt="sd"
          height={420}
          width={420}
          className="hidden md:block absolute -left-30 -top-20 bg-[#0001] p-4 rounded-full "
        />
        <img
          src="platebg.svg"
          alt="sd"
          height={420}
          width={420}
          className="hidden md:block absolute -left-30 -top-20  p-4 rounded-full "
        />
        <img
          src="platebg.svg"
          alt="sd"
          height={420}
          width={420}
          className="hidden md:block absolute -right-30 top-50 bg-[#0001] p-4 rounded-full "
        />
        <img
          src="platebg.svg"
          alt="sd"
          height={420}
          width={420}
          className="hidden md:block absolute -right-30 top-50   p-4 rounded-full "
        />
      </section>

      <Footer />
    </div>
  );
}
