"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Apple, Chrome, Send, Bot, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";

const AuthSignIn = () => {
  const router = useRouter();
  const { login, register, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sequential message animation state for 6 agents grid
  const [visibleMessages, setVisibleMessages] = useState<Record<string, number>>({});
  
  // AI Agents Data
  const aiAgents = [
    {
      id: "support",
      name: "AKOBOT AI Support",
      initial: "S",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/20",
      borderColor: "border-pink-500/30",
      messages: [
        { role: "assistant", content: "Hello, how can I assist you?", time: "06:18 PM" },
        { role: "user", content: "Can you raise a ticket for me?", time: "06:18 PM" },
      ],
    },
    {
      id: "sales",
      name: "Sales Agent",
      initial: "A",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
      messages: [
        { role: "assistant", content: "Hello, how's your day?", time: "06:18 PM" },
        { role: "user", content: "Great!", time: "06:18 PM" },
      ],
    },
    {
      id: "lead",
      name: "Lead Agent",
      initial: "L",
      color: "from-purple-600 to-purple-800",
      bgColor: "bg-purple-700/20",
      borderColor: "border-purple-700/30",
      messages: [
        { role: "assistant", content: "How's your day?", time: "06:18 PM" },
        { role: "user", content: "Great! Can you give me today's leads you fetched?", time: "06:18 PM" },
        { role: "assistant", content: "Here's the list of 10 websites related to our product use case.", time: "06:18 PM" },
      ],
    },
    {
      id: "image",
      name: "Image Creation Agent",
      initial: "I",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      messages: [
        { role: "assistant", content: "How's your day?", time: "06:18 PM" },
        { role: "user", content: "Good! Can you generate 50 images for me related to 3D comic Marvel characters and post them to my mail?", time: "06:18 PM" },
        { role: "assistant", content: "Done, I'll do it.", time: "06:18 PM" },
      ],
    },
    {
      id: "content",
      name: "Content Creation Agent",
      initial: "C",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30",
      messages: [
        { role: "assistant", content: "How's your day?", time: "06:18 PM" },
        { role: "user", content: "Hi, I'm good. Can you give me today's report?", time: "06:18 PM" },
        { role: "assistant", content: "Sure, and I'll give you a PDF of the report. Can you share the mail to the following 30 members?", time: "06:18 PM" },
        { role: "user", content: "Share.", time: "06:18 PM" },
      ],
    },
    {
      id: "analytics",
      name: "Data Analytics Agent",
      initial: "D",
      color: "from-purple-700 to-indigo-800",
      bgColor: "bg-purple-800/20",
      borderColor: "border-purple-800/30",
      messages: [
        { role: "assistant", content: "How's it going?", time: "06:18 PM" },
        { role: "user", content: "Good! Can you pull yesterday's metrics?", time: "06:18 PM" },
        { role: "assistant", content: "Here are your key metrics and the summary dashboard.", time: "06:18 PM" },
      ],
    },
  ];

  // Initialize sequential message animations - First agent completes, then next starts
  useEffect(() => {
    const baseDelay = 1000; // Initial delay before first message
    const messageInterval = 800; // Time between messages in same agent
    const agentInterval = 400; // Small gap between agents
    
    let totalDelay = baseDelay;
    
    aiAgents.forEach((agent, agentIndex) => {
      // Each agent's messages appear sequentially
      agent.messages.forEach((_, messageIndex) => {
        const messageDelay = totalDelay + (messageIndex * messageInterval);
        
        setTimeout(() => {
          setVisibleMessages((prev) => ({
            ...prev,
            [`${agent.id}-${messageIndex}`]: messageIndex + 1,
          }));
        }, messageDelay);
      });
      
      // Update total delay for next agent (after all messages of current agent)
      totalDelay += (agent.messages.length * messageInterval) + agentInterval;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isSignUp) {
      if (!username) {
        toast.error("Please enter a username");
        return;
      }
      if (username.length < 3) {
        toast.error("Username must be at least 3 characters");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        // Register - backend expects: { username, email, password }
        await register(email, username, password);
        toast.success("Account created successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        // Login - backend expects: { identifier, password }
        await login(email, password);
        toast.success("Logged in successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      // Handle validation errors array
      if (error?.message && Array.isArray(error.message)) {
        const errorMessages = error.message.join(", ");
        toast.error(errorMessages);
      } else {
        const errorMessage = error?.message || error?.error || "Authentication failed. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Login/Signup UI */}
      <div className="w-full lg:w-[480px] bg-card flex flex-col p-8 lg:p-8 relative z-10 overflow-hidden border-r border-border">
        {/* Animated Background Glow Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 relative z-10"
        >
          <Logo size="lg" showText={true} href="/" />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-foreground text-3xl font-bold mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isSignUp ? "Join AEKO Creative Suite today" : "Sign in to continue to your dashboard"}
          </p>
        </motion.div>

        {/* OAuth Buttons - Commented out for now */}
        {/* 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="w-full h-14 bg-secondary hover:bg-secondary/80 border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleSignIn}
            >
              <div className="relative z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="font-semibold text-base relative z-10">Google</span>
            </Button>
          </motion.div>
        </motion.div>
        */}

        {/* Email/Password Form - Always Visible */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5 flex-1"
        >
          {/* Sign In / Sign Up Toggle */}
          <div className="flex gap-2 p-1 bg-secondary rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 h-10 rounded-md text-sm font-semibold transition-all duration-300 ${
                !isSignUp 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 h-10 rounded-md text-sm font-semibold transition-all duration-300 ${
                isSignUp 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Username Field - Only for Sign Up */}
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "linear",
                }}
              />
              <span className="relative z-10">
                {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
              </span>
            </Button>
          </motion.div>
        </motion.form>

        {/* Need help link */}
        <div className="pt-4">
          <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 inline-flex items-center gap-1 group">
            Need help?
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary"
            >
              →
            </motion.span>
          </Link>
        </div>

        {/* Mobile App Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-auto pt-8"
        >
          <p className="text-foreground text-sm mb-4 font-medium">Soon Available now on iOS and Android</p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                onClick={() => toast.info("App Store link coming soon")}
              >
                <Apple className="w-5 h-5 mr-2" />
                <span className="text-xs font-semibold">App Store</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                onClick={() => toast.info("Google Play link coming soon")}
              >
                <Chrome className="w-5 h-5 mr-2" />
                <span className="text-xs font-semibold">Google Play</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Right Panel - AI Agents in Action Grid */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
        {/* Enhanced Animated Stars Background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 120 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2.5 + 0.5,
                height: Math.random() * 2.5 + 0.5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.9, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Animated Nebula/Cloud Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: `${200 + Math.random() * 300}px`,
                height: `${200 + Math.random() * 300}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i === 0 
                  ? 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)'
                  : i === 1
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)'
                  : 'radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent)',
              }}
              animate={{
                x: [0, Math.random() * 200 - 100, 0],
                y: [0, Math.random() * 200 - 100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
            />
          ))}
        </div>

        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated Light Rays */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"
              style={{
                left: `${20 + i * 25}%`,
                transform: `rotate(${15 + i * 10}deg)`,
                transformOrigin: 'top center',
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Agents Grid Container */}
        <div className="relative z-10 flex flex-col h-full w-full p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h2 className="text-xl font-bold text-white mb-1">AI agents in action</h2>
            <p className="text-xs text-gray-400">Experience our AI agents working in real-time</p>
          </motion.div>

          {/* Agents Grid - 2 rows x 3 columns */}
          <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3 overflow-hidden">
            {aiAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Agent Header */}
                <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {agent.initial}
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white leading-tight">{agent.name}</h3>
                    </div>
                  </div>
                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-green-400">Always Available</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <AnimatePresence>
                    {agent.messages.map((message, msgIndex) => {
                      const messageKey = `${agent.id}-${msgIndex}`;
                      const isVisible = visibleMessages[messageKey] !== undefined;
                      
                      return (
                        <motion.div
                          key={msgIndex}
                          initial={{ opacity: 0, y: 15, scale: 0.9 }}
                          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 15, scale: 0.9 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ 
                            duration: 0.5, 
                            ease: [0.34, 1.56, 0.64, 1], // Bouncy ease
                          }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <motion.div
                            initial={{ scale: 0.85 }}
                            animate={isVisible ? { scale: 1 } : { scale: 0.85 }}
                            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                            className={`max-w-[85%] rounded-lg px-2.5 py-1.5 backdrop-blur-md ${
                              message.role === "user"
                                ? "bg-primary/50 border border-primary/60 text-white shadow-xl shadow-primary/30"
                                : "bg-gray-700/70 border border-gray-600/50 text-gray-200 shadow-lg"
                            }`}
                          >
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                              className="text-[10px] leading-relaxed whitespace-pre-wrap"
                            >
                              {isVisible ? message.content : ''}
                            </motion.p>
                            <motion.p 
                              initial={{ opacity: 0, y: 2 }}
                              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 2 }}
                              transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
                              className="text-[9px] text-gray-400 mt-0.5"
                            >
                              {isVisible ? message.time : ''}
                            </motion.p>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Input Field */}
                <div className="p-2 border-t border-white/10 bg-white/5">
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5">
                    <MessageCircle className="w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Ask ${agent.name.split(' ')[0]}...`}
                      className="flex-1 bg-transparent border-0 text-[10px] text-white placeholder:text-gray-500 focus:outline-none focus:ring-0"
                      readOnly
                    />
                    <Send className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSignIn;



// import { useState, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Mail, Apple, Chrome } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { useAuth } from "@/hooks/use-auth";
// import Logo from "@/components/Logo";

// // Video Configuration
// const VIDEO_PLAYLIST = [
//   {
//     src: "/feeds/video19.mp4",
//     title: "AI-Powered Intelligence",
//     description: "Experience the next generation of neural processing. Our agents analyze data in real-time."
//   },
//   {
//     src: "/feeds/video20.mp4",
//     title: "Seamless Integration",
//     description: "Connect your entire workflow with a single click. Automate complex tasks with precision."
//   }
// ];

// const AuthSignIn = () => {
//   const navigate = useNavigate();
//   const { login, register, refreshUser } = useAuth();
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [showEmailForm, setShowEmailForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Video State Management
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const handleVideoEnd = () => {
//     setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEO_PLAYLIST.length);
//   };

//   // Function to slow down video
//   const setSlowMotion = (e: React.SyntheticEvent<HTMLVideoElement>) => {
//     e.currentTarget.playbackRate = 0.5; // 50% speed
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (isSignUp && !username) {
//       toast.error("Please enter a username");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       if (isSignUp) {
//         // Register
//         await register(email, username, password);
//         toast.success("Account created successfully!");
//         router.push("/dashboard");
//       } else {
//         // Login
//         await login(email, password);
//         toast.success("Logged in successfully!");
//         router.push("/dashboard");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Authentication failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsLoading(true);
//       // Import authAPI for Google login since it's a special case
//       const { authAPI } = await import("@/lib/api");
//       const result = await authAPI.googleLogin();
//       // If redirectUrl is provided, the API will redirect automatically
//       // Otherwise, check if we got tokens directly
//       if (result.accessToken) {
//         // Refresh user from context
//         refreshUser();
//         // Dispatch event to update UI
//         window.dispatchEvent(new Event('auth-storage-change'));
//         toast.success("Logged in with Google!");
//         router.push("/dashboard");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Google sign-in failed. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const currentVideo = VIDEO_PLAYLIST[currentVideoIndex];

//   return (
//     <div className="min-h-screen flex bg-background">
//       {/* Left Panel - Login/Signup UI */}
//       <div className="w-full lg:w-[480px] bg-card flex flex-col p-8 lg:p-8 relative z-10 overflow-hidden border-r border-border">
//         {/* Animated Background Glow Effects */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <motion.div
//             className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
//             animate={{
//               x: [0, 50, 0],
//               y: [0, 30, 0],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: 8,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//           <motion.div
//             className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
//             animate={{
//               x: [0, -50, 0],
//               y: [0, -30, 0],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         </div>
//         <div className="relative z-10 flex flex-col h-full">
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-12 relative z-10"
//         >
//           <Logo size="lg" showText={true} href="/" />
//         </motion.div>

//         {/* Sign up or Login with */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="mb-8"
//         >
//           <h2 className="text-foreground text-2xl font-semibold mb-1">
//             {isSignUp ? "Create your account" : "Sign up or Login with"}
//           </h2>
//           <p className="text-muted-foreground text-sm">
//             {isSignUp ? "Join AEKO Creative Suite today" : "Get started with AI-powered creativity"}
//           </p>
//         </motion.div>

//         {/* Login Options */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="space-y-3 flex-1"
//         >
//           {/* Google */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={isLoading}
//               className="w-full h-14 bg-secondary hover:bg-secondary/80 dark:bg-[#1F2937] dark:hover:bg-[#374151] border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleGoogleSignIn}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full bg-white dark:bg-white flex items-center justify-center">
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//               </div>
//               <span className="font-semibold text-base relative z-10">Google</span>
//             </Button>
//           </motion.div>

//           {/* GitHub */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-secondary hover:bg-secondary/80 dark:bg-[#0D1117] dark:hover:bg-[#161B22] border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
//               onClick={() => navigate("/dashboard/tools/agent")}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center">
//                 <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
//                   <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
//                 </svg>
//               </div>
//               <span className="font-semibold text-base relative z-10">GitHub</span>
//             </Button>
//           </motion.div>

//           {/* Apple */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-foreground hover:bg-foreground/90 dark:bg-[#000000] dark:hover:bg-[#1C1C1C] text-background dark:text-white justify-start gap-3 rounded-xl transition-all duration-300 border-0 shadow-sm hover:shadow-md"
//               onClick={() => navigate("/dashboard/tools/agent")}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full bg-background/20 dark:bg-white/10 flex items-center justify-center">
//                 <Apple className="w-5 h-5 text-background dark:text-white" />
//               </div>
//               <span className="font-semibold text-base relative z-10">Apple</span>
//             </Button>
//           </motion.div>

//           {/* Microsoft */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-secondary hover:bg-secondary/80 dark:bg-[#2F2F2F] dark:hover:bg-[#3A3A3A] border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
//               onClick={() => navigate("/dashboard/tools/agent")}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-lg bg-white dark:bg-white flex items-center justify-center">
//                 <div className="w-4 h-4 bg-secondary dark:bg-[#2F2F2F] rounded-sm grid grid-cols-2 gap-0.5">
//                   <div className="bg-[#F25022]"></div>
//                   <div className="bg-[#7FBA00]"></div>
//                   <div className="bg-[#00A4EF]"></div>
//                   <div className="bg-[#FFB900]"></div>
//                 </div>
//               </div>
//               <span className="font-semibold text-base relative z-10">Microsoft</span>
//             </Button>
//           </motion.div>

//           {/* Continue with Email - Main CTA */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-white justify-start gap-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border-0"
//               onClick={() => setShowEmailForm(!showEmailForm)}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
//                 <Mail className="w-4 h-4 text-white" />
//               </div>
//               <span className="font-semibold text-base relative z-10">Continue with Email</span>
//             </Button>
//           </motion.div>

//           {/* Email/Password Form - Show when Continue with Email is clicked */}
//           {showEmailForm && (
//             <motion.form
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               onSubmit={handleSubmit}
//               className="mt-4 space-y-4 p-6 bg-card/90 dark:bg-card/90 rounded-xl border-2 border-border shadow-xl backdrop-blur-sm"
//             >
//               {isSignUp && (
//                 <div>
//                   <Input
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="h-12 bg-background dark:bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                   />
//                 </div>
//               )}
//               <div>
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="h-12 bg-background dark:bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
//               <div>
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="h-12 bg-background dark:bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsSignUp(false)}
//                   className={`flex-1 h-11 border-2 text-foreground font-semibold rounded-lg transition-all duration-300 ${
//                     !isSignUp 
//                       ? "bg-primary/20 dark:bg-primary/30 border-primary shadow-lg shadow-primary/20" 
//                       : "bg-secondary/50 dark:bg-card/60 border-border hover:border-primary/40"
//                   }`}
//                 >
//                   Sign In
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsSignUp(true)}
//                   className={`flex-1 h-11 border-2 text-foreground font-semibold rounded-lg transition-all duration-300 ${
//                     isSignUp 
//                       ? "bg-primary/20 dark:bg-primary/30 border-primary shadow-lg shadow-primary/20" 
//                       : "bg-secondary/50 dark:bg-card/60 border-border hover:border-primary/40"
//                   }`}
//                 >
//                   Sign Up
//                 </Button>
//               </div>
//               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                     animate={{
//                       x: ['-100%', '100%'],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       repeatDelay: 1,
//                       ease: "linear",
//                     }}
//                   />
//                   <span className="relative z-10">
//                     {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
//                   </span>
//                 </Button>
//               </motion.div>
//             </motion.form>
//           )}

//           {/* Need help link */}
//           <div className="pt-4">
//             <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 inline-flex items-center gap-1 group">
//               Need help?
//               <motion.span
//                 animate={{ x: [0, 4, 0] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="text-primary"
//               >
//                 →
//               </motion.span>
//             </Link>
//           </div>
//         </motion.div>

//         {/* Mobile App Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="mt-auto pt-8"
//         >
//           <p className="text-foreground text-sm mb-4 font-medium">Available now on iOS and Android</p>
//           <div className="flex gap-3">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
//               <Button
//                 variant="outline"
//                 className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
//                 onClick={() => toast.info("App Store link coming soon")}
//               >
//                 <Apple className="w-5 h-5 mr-2" />
//                 <span className="text-xs font-semibold">App Store</span>
//               </Button>
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
//               <Button
//                 variant="outline"
//                 className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
//                 onClick={() => toast.info("Google Play link coming soon")}
//               >
//                 <Chrome className="w-5 h-5 mr-2" />
//                 <span className="text-xs font-semibold">Google Play</span>
//               </Button>
//             </motion.div>
//           </div>
//         </motion.div>
//         </div>
//       </div>

//       {/* Right Panel - Full Screen Video Background with Bottom-Only Shadow */}
//       <div className="hidden lg:block flex-1 relative overflow-hidden bg-black">
//         {/* Cinematic Video Player */}
//         <AnimatePresence mode="popLayout">
//           <motion.div 
//             key={currentVideoIndex}
//             className="absolute inset-0 w-full h-full"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1.2, ease: "easeInOut" }}
//           >
//             <video
//               ref={videoRef}
//               src={currentVideo.src}
//               className="absolute inset-0 w-full h-full object-cover"
//               autoPlay
//               muted
//               loop={false}
//               playsInline
//               onEnded={handleVideoEnd}
//               onLoadedMetadata={setSlowMotion}
//             />
//           </motion.div>
//         </AnimatePresence>

//         {/* The "Black Shadow" Overlay - RESTRICTED TO BOTTOM 50% */}
//         <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black via-black/70 to-transparent z-10 pointer-events-none" />
        
//         {/* Content Description Area */}
//         <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentVideoIndex}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="max-w-2xl"
//             >
//               {/* Badge/Tag */}
//               <motion.div 
//                 className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4"
//                 initial={{ width: 0, opacity: 0 }}
//                 animate={{ width: "auto", opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
//                 <span className="text-xs font-medium text-white tracking-wide uppercase">Now Showing</span>
//               </motion.div>

//               {/* Title */}
//               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
//                 {currentVideo.title}
//               </h1>

//               {/* Description */}
//               <p className="text-lg text-gray-300 leading-relaxed font-light">
//                 {currentVideo.description}
//               </p>
//             </motion.div>
//           </AnimatePresence>

//           {/* Progress Indicators */}
//           <div className="flex gap-2 mt-8">
//             {VIDEO_PLAYLIST.map((_, idx) => (
//               <motion.div
//                 key={idx}
//                 className={`h-1 rounded-full overflow-hidden ${
//                   idx === currentVideoIndex ? "w-16 bg-white" : "w-4 bg-white/20"
//                 }`}
//                 layout
//                 transition={{ duration: 0.3 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthSignIn;