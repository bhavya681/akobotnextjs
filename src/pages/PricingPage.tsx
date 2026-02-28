"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Zap, HeadphonesIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { packageAPI, paymentAPI, authAPI, isPaymentBackendMisconfigured, type PaymentGateway } from "@/lib/api";
import { PaymentGatewayDialog } from "@/components/PaymentGatewayDialog";
import { toast } from "sonner";

interface Package {
  _id: string;
  name: string;
  description?: string;
  includedCredits: number;
  actualPrice?: number;
  currentPrice: number;
  offer?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const freeFeatures = [
  "1 Basic AI Agent with image tool integration",
  "20 Prompts per day",
  "3 Images per day",
  "Watermarked outputs",
  "Standard support",
  "Cloud storage",
];

const enterpriseFeatures = [
  "Unlimited AI Agents",
  "Unlimited integrations",
  "Custom API access",
  "Multi-user team management",
  "Dedicated support",
  "SLA uptime",
  "Dedicated S3 storage",
];

/**
 * PricingPage Component
 * 
 * IMPORTANT: This component ONLY displays packages fetched from the backend API.
 * NO static packages or hardcoded pricing plans are used.
 * 
 * Data Flow:
 * 1. Fetches packages from GET /api/packages (public endpoint)
 * 2. Filters for isActive = true packages
 * 3. Sorts by sortOrder (ascending)
 * 4. Displays packages with offer badges, prices, and credits
 * 5. Handles Razorpay payment flow when user clicks "Buy Now"
 */
const PricingPage = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [processing, setProcessing] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [gatewayDialogOpen, setGatewayDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);


  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      setRazorpayLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error("Failed to load payment gateway. Please refresh the page.");
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);


  // Fetch packages from backend
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching packages from backend API...");
      
      // Fetch packages from backend API - ONLY dynamic backend data, NO static packages
      const data = await packageAPI.getAll();
      console.log("✅ Packages API response:", data);
      
      // Handle response - API should return array of packages
      let packagesList: Package[] = [];
      if (Array.isArray(data)) {
        packagesList = data;
      } else if (data && typeof data === 'object') {
        packagesList = (data as any).packages || (data as any).data || (data as any).items || [];
        if (!Array.isArray(packagesList) && (data as any)._id) {
          packagesList = [data as Package];
        }
      }
      
      // Filter and validate packages from backend (only show isActive = true)
      const validPackages = packagesList
        .filter((pkg: any) => {
          return pkg && 
                 pkg._id && 
                 pkg.name && 
                 typeof pkg.currentPrice === 'number' && pkg.currentPrice >= 0 &&
                 typeof pkg.includedCredits === 'number' && pkg.includedCredits >= 1 &&
                 (pkg.isActive === undefined || pkg.isActive === true);
        })
        .sort((a: Package, b: Package) => {
          // Sort by sortOrder (ascending) as per API spec, then by price
          if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
            return a.sortOrder - b.sortOrder;
          }
          if (a.sortOrder !== undefined) return -1;
          if (b.sortOrder !== undefined) return 1;
          return (a.currentPrice || 0) - (b.currentPrice || 0);
        });
      
      console.log(`✅ Valid packages after filtering: ${validPackages.length}`);
      setPackages(validPackages);
    } catch (error: any) {
      console.error("❌ Error fetching packages:", error);
      toast.error(`Failed to load packages: ${error.message || 'Unknown error'}`);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const proceedWithPayment = async (pkg: Package, gateway: PaymentGateway) => {
    if (!pkg?._id || !gateway?.name) return;
    try {
      setProcessing(pkg._id);
      console.log("🔄 Creating order for package:", pkg._id, "gateway:", gateway.name);
      console.log("📦 Package details:", {
        _id: pkg._id,
        name: pkg.name,
        currentPrice: pkg.currentPrice,
        includedCredits: pkg.includedCredits,
      });
      
      // Validate package before creating order
      if (!pkg._id || typeof pkg._id !== 'string' || pkg._id.trim() === '') {
        toast.error("Invalid package. Please try again.");
        setProcessing(null);
        return;
      }
      
      const orderData = await paymentAPI.createOrder(pkg._id, gateway.name);
      console.log("✅ Order data received:", orderData);

      // Validate order response
      if (!orderData || !orderData.orderId) {
        console.error("❌ Invalid order data:", orderData);
        toast.error("Invalid order data received from server. Missing orderId.");
        setProcessing(null);
        return;
      }

      if (gateway.name === "stripe" && (orderData as any).checkoutUrl) {
        window.location.href = (orderData as any).checkoutUrl;
        return;
      }

      if (gateway.name !== "razorpay") {
        toast.error("This payment gateway is not yet supported.");
        setProcessing(null);
        return;
      }
      
      // Warn if keyId is missing (will use fallback)
      if (!orderData.keyId) {
        console.warn("⚠️ Response missing keyId, using fallback Razorpay key");
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay || !razorpayLoaded) {
        toast.error("Payment gateway is still loading. Please wait a moment and try again.");
        setProcessing(null);
        return;
      }

      // Use Razorpay key from backend response, with fallback
      // The fallback key should match your Razorpay account
      const razorpayKey = orderData.keyId || orderData.key || "rzp_live_SHVupFMQeg2X3E=4glMkH0SBzhBi3u0VsvcxB5K";
      
      if (!razorpayKey) {
        toast.error("Payment gateway key not configured. Please contact support.");
        setProcessing(null);
        return;
      }
      
      console.log("Using Razorpay key:", razorpayKey.substring(0, 10) + "...");
      
      // Get current user info for prefill
      const currentUser = authAPI.getCurrentUser();
      
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        order_id: orderData.orderId,
        name: "AEKO.AI",
        description: `Purchase ${pkg.name}`,
        image: "/logo.png",
        handler: async (response: any) => {
          try {
            console.log("Payment response:", response);
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Credits have been added to your wallet.");
            setProcessing(null);
            // Navigate to dashboard after successful payment
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast.error(error.message || "Payment verification failed");
            setProcessing(null);
          }
        },
        prefill: {
          name: currentUser?.username || currentUser?.name || "",
          email: currentUser?.email || "",
          contact: currentUser?.phone || "",
        },
        notes: {
          packageId: pkg._id,
          packageName: pkg.name,
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed");
            setProcessing(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response);
        toast.error(response.error?.description || "Payment failed");
        setProcessing(null);
      });
      rzp.open();
    } catch (error: any) {
      console.error("❌ Payment initiation error:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      
      // Use server/API message when it explains the fix (e.g. VITE_API_URL misconfiguration)
      let errorMessage = "Failed to initiate payment. Please try again.";
      if (error.message?.includes("VITE_API_URL") || error.message?.includes("wrong server")) {
        errorMessage = error.message;
      } else if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        errorMessage = "Please sign in to purchase a package";
        router.push(`/auth/sign-in?returnTo=${encodeURIComponent("/pricing")}`);
      } else if (error.message?.includes("404")) {
        errorMessage = "Package not found. Please try another package.";
      } else if (error.message?.includes("400") || error.message?.includes("Bad Request")) {
        errorMessage = error.message || "Invalid package or payment configuration. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setProcessing(null);
    }
  };

  const handleBuyPackage = (pkg: Package) => {
    if (!pkg || !pkg._id) {
      toast.error("Package not available");
      return;
    }
    if (!authAPI.isAuthenticated()) {
      toast.error("Please sign in to purchase a package");
      router.push(`/auth/sign-in?returnTo=${encodeURIComponent("/pricing")}`);
      return;
    }
    setSelectedPackage(pkg);
    setGatewayDialogOpen(true);
  };

  const handleGatewaySelect = (gateway: PaymentGateway) => {
    if (selectedPackage) {
      const pkg = selectedPackage;
      setSelectedPackage(null);
      setGatewayDialogOpen(false);
      proceedWithPayment(pkg, gateway);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden w-full relative bg-background">
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/70 dark:bg-none" />
        <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block" style={{
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #2d1b4e 55%, #3b2a5c 75%, #4c2d5e 90%, #5c3a5a 100%)",
        }} />
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading packages...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden w-full relative bg-background">
      {/* Light mode: soft gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/70 dark:bg-none" />
      {/* Dark mode: deep indigo → violet → soft rose */}
      <div
        className="fixed inset-0 pointer-events-none z-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #2d1b4e 55%, #3b2a5c 75%, #4c2d5e 90%, #5c3a5a 100%)",
        }}
      />
      {/* Subtle grid overlay - light mode */}
      <div
        className="fixed inset-0 pointer-events-none z-0 dark:hidden opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Subtle grid overlay - dark mode */}
      <div
        className="fixed inset-0 pointer-events-none z-0 hidden dark:block opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {isPaymentBackendMisconfigured() && (
          <div className="bg-amber-500/20 border border-amber-400/50 text-amber-900 dark:text-amber-100 px-4 py-3 text-center text-sm">
            Payment needs your main backend. Set <code className="bg-amber-500/20 dark:bg-black/30 px-1 rounded">VITE_MAIN_API_URL</code> in <code className="bg-amber-500/20 dark:bg-black/30 px-1 rounded">.env</code> to your backend URL (e.g. <code className="bg-amber-500/20 dark:bg-black/30 px-1 rounded">http://localhost:5000</code>). Keep <code className="bg-amber-500/20 dark:bg-black/30 px-1 rounded">VITE_API_URL</code> for chat if needed. Restart the app after changing.
          </div>
        )}

        <section className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            {/* Heading + Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2 tracking-tight">
                Plans & Pricing
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mb-5 max-w-md mx-auto">
                Choose the right plan for your team. Upgrade or downgrade anytime.
              </p>
              <div className="inline-flex items-center rounded-full bg-muted/80 dark:bg-white/10 backdrop-blur-sm border border-border dark:border-violet-400/20 p-0.5 mb-4">
                <button
                  type="button"
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "monthly"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "text-muted-foreground dark:text-violet-200/80 hover:text-foreground dark:hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod("yearly")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "yearly"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "text-muted-foreground dark:text-violet-200/80 hover:text-foreground dark:hover:text-white"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </motion.div>

            {/* List packages: Free + each package (Buy → Razorpay) + Enterprise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
              {/* Left: Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl p-5 sm:p-6 flex flex-col bg-card dark:bg-black border border-border dark:border-violet-400/15 hover:border-primary/30 dark:hover:border-violet-400/25 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-violet-500/10 transition-all"
              >
                <h2 className="text-lg font-bold text-foreground dark:text-white mb-1">Free</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-foreground dark:text-white">₹0</span>
                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>
                <Button
                  onClick={() => router.push("/auth/sign-in")}
                  variant="secondary"
                  className="w-full rounded-xl h-10 bg-primary/10 dark:bg-violet-500/20 hover:bg-primary/20 dark:hover:bg-violet-500/30 text-foreground dark:text-violet-100 border border-border dark:border-violet-400/25 mb-4 text-sm font-medium"
                >
                  Try Now
                </Button>
                <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground dark:text-violet-100/90">
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Dynamic packages: click Buy → open Razorpay */}
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-6 flex flex-col items-center justify-center bg-card dark:bg-black border border-border dark:border-violet-400/15 min-h-[280px]"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-muted-foreground text-sm">Loading packages...</p>
                </motion.div>
              ) : packages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-6 flex flex-col items-center justify-center bg-card dark:bg-black border border-border dark:border-violet-400/15 min-h-[200px] col-span-1 sm:col-span-2"
                >
                  <p className="text-muted-foreground text-sm mb-1">No packages available</p>
                  <p className="text-muted-foreground/70 text-xs">Check back later or contact support</p>
                </motion.div>
              ) : (
                packages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl p-5 sm:p-6 flex flex-col bg-card dark:bg-black border-2 border-primary/20 dark:border-violet-400/30 hover:border-primary/40 dark:hover:border-violet-400/50 shadow-lg shadow-primary/10 dark:shadow-violet-500/10 transition-all"
                  >
                    {pkg.offer && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                          <Sparkles className="w-3 h-3" />
                          {pkg.offer}
                        </span>
                      </div>
                    )}
                    <h2 className="text-lg font-bold text-foreground dark:text-white mb-1">{pkg.name}</h2>
                    <div className="flex items-baseline gap-2 flex-wrap mb-2">
                      {pkg.actualPrice != null && pkg.actualPrice > pkg.currentPrice && (
                        <span className="text-base font-medium text-muted-foreground line-through">
                          ₹{pkg.actualPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-foreground dark:text-white">
                        ₹{pkg.currentPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-muted-foreground">one-time</span>
                    </div>
                    {pkg.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{pkg.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mb-4">
                      <span className="font-semibold">{pkg.includedCredits.toLocaleString("en-IN")}</span> credits
                    </p>
                    <Button
                      onClick={() => handleBuyPackage(pkg)}
                      disabled={processing === pkg._id || !razorpayLoaded}
                      className="w-full rounded-xl h-10 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-600 text-white font-semibold hover:opacity-95 shadow-lg shadow-violet-500/25 text-sm disabled:opacity-50 mt-auto"
                    >
                      {processing === pkg._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Opening Razorpay...
                        </>
                      ) : !razorpayLoaded ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                  </motion.div>
                ))
              )}

              {/* Right: Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl p-5 sm:p-6 flex flex-col bg-card dark:bg-black border border-border dark:border-violet-400/15 hover:border-primary/30 dark:hover:border-violet-400/25 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-violet-500/10 transition-all"
              >
                <h2 className="text-lg font-bold text-foreground dark:text-white mb-1">Enterprise</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-foreground dark:text-white">Custom</span>
                </div>
                <Button
                  onClick={() => router.push("/auth/sign-in")}
                  variant="outline"
                  className="w-full rounded-xl h-10 bg-primary/10 dark:bg-violet-500/15 hover:bg-primary/20 dark:hover:bg-violet-500/25 text-foreground dark:text-violet-100 border border-border dark:border-violet-400/25 mb-4 text-sm font-medium"
                >
                  Contact Sales
                </Button>
                <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                  {enterpriseFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground dark:text-violet-100/90">
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>


        {/* Pricing page footer - benefits & trust */}
        <footer className="relative z-10 border-t border-border dark:border-violet-400/15 bg-muted/30 dark:bg-black/20 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left"
            >
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-violet-500/20 border border-primary/20 dark:border-violet-400/20">
                  <Shield className="w-5 h-5 text-primary dark:text-violet-300" />
                </div>
                <h3 className="text-sm font-semibold text-foreground dark:text-white">Secure & reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security. Your data stays yours.
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-violet-500/20 border border-primary/20 dark:border-violet-400/20">
                  <Zap className="w-5 h-5 text-primary dark:text-violet-300" />
                </div>
                <h3 className="text-sm font-semibold text-foreground dark:text-white">Cancel anytime</h3>
                <p className="text-sm text-muted-foreground">
                  No long-term lock-in. Upgrade or downgrade as you grow.
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-violet-500/20 border border-primary/20 dark:border-violet-400/20">
                  <HeadphonesIcon className="w-5 h-5 text-primary dark:text-violet-300" />
                </div>
                <h3 className="text-sm font-semibold text-foreground dark:text-white">Support when you need it</h3>
                <p className="text-sm text-muted-foreground">
                  Documentation, chat, and dedicated support on higher plans.
                </p>
              </div>
            </motion.div>
            <div className="mt-10 pt-8 border-t border-border dark:border-violet-400/10 text-center">
              <p className="text-sm text-muted-foreground">
                Questions? <Link href="/dashboard/support" className="text-primary hover:underline underline-offset-2">Contact support</Link> or{" "}
                <Link href="/auth/sign-in" className="text-primary hover:underline underline-offset-2">sign in</Link> to get started.
              </p>
            </div>
          </div>
          {/* Sub-footer */}
          <div className="border-t border-border dark:border-violet-400/10 bg-muted/20 dark:bg-black/30">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} AEKO.AI. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
                <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </div>
            </div>
          </div>
        </footer>

        <Footer />

        <PaymentGatewayDialog
          open={gatewayDialogOpen}
          onOpenChange={setGatewayDialogOpen}
          onSelect={handleGatewaySelect}
        />
      </div>
    </main>
  );
};

export default PricingPage;
