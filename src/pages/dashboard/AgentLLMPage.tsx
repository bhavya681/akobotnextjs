"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Image as ImageIcon,
  Video,
  LayoutGrid,
  Infinity as InfinityIcon,
  Maximize2,
  Square,
  PenTool,
  Mic,
  Plus,
  Sparkles,
  FileText,
  Code,
  Crown,
  Upload,
  Bot,
  ChevronDown,
  Wand2,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ArrowRight,
  Globe,
} from "lucide-react";
import { moduleAPI, providerAPI, SARVAM_VOICE_WS_URL } from "@/lib/api";
import { toast } from "sonner";
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responseTime?: string;
}

const contentTypes = [
  { id: "design", label: "Design", icon: Sparkles, isSelected: true },
  { id: "image", label: "Image", icon: ImageIcon, isSelected: false },
  { id: "doc", label: "Doc", icon: FileText, isSelected: false },
  { id: "code", label: "</> Code", icon: Code, isSelected: false },
  { id: "video", label: "Video clip", icon: Video, isSelected: false, isPremium: true },
];

const availableAgents = [
  { id: "1", name: "Cnergee" },
  { id: "2", name: "Instagram" },
  { id: "3", name: "Yamaha Motor" },
  { id: "4", name: "Standard Agent" },
];

interface ModelInfo {
  name: string;
  model: string;
  modified_at?: string;
  size?: string;
  digest?: string;
  details?: any;
}

const AgentLLMPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState("design");
  const [selectedAgent, setSelectedAgent] = useState<string>("4"); // Default to Standard
  const [agentMood, setAgentMood] = useState("Professional");
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [loadingModels, setLoadingModels] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceSocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const ttsChunksRef = useRef<string[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const agentMoods = [
    { id: "professional", label: "Professional" },
    { id: "friendly", label: "Friendly" },
    { id: "sales", label: "Sales" },
    { id: "creative", label: "Creative" },
  ];

  useEffect(() => {
    const query = searchParams?.get("q");
    if (query) {
      setInput(query);
      if (pathname) {
        router.replace(pathname);
      }
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Fetch available models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoadingModels(true);
      const data = await providerAPI.getModels();
      // Handle different response formats
      let models: ModelInfo[] = [];
      
      if (Array.isArray(data)) {
        // Check if array contains objects or strings
        if (data.length > 0 && typeof data[0] === 'object') {
          // Array of model objects
          models = data.map((item: any) => ({
            name: item.name || item.model || 'Unknown',
            model: item.model || item.name || '',
            modified_at: item.modified_at,
            size: item.size,
            digest: item.digest,
            details: item.details,
          }));
        } else {
          // Array of strings
          models = data.map((model: string) => ({
            name: model,
            model: model,
          }));
        }
      } else if (data && typeof data === 'object') {
        // If it's an object, try to extract models array
        const modelsArray = (data as any).models || (data as any).data || Object.values(data);
        if (Array.isArray(modelsArray)) {
          if (modelsArray.length > 0 && typeof modelsArray[0] === 'object') {
            models = modelsArray.map((item: any) => ({
              name: item.name || item.model || 'Unknown',
              model: item.model || item.name || '',
              modified_at: item.modified_at,
              size: item.size,
              digest: item.digest,
              details: item.details,
            }));
          } else {
            models = modelsArray.map((model: string) => ({
              name: model,
              model: model,
            }));
          }
        }
      }
      
      setAvailableModels(models);
      // Set default model if available
      if (models.length > 0 && !selectedModel) {
        setSelectedModel(models[0].model);
      }
    } catch (error: any) {
      console.error("Error fetching models:", error);
      toast.error(error.message || "Failed to load available models");
      // Set a default fallback model
      const fallbackModel: ModelInfo = {
        name: "gpt-oss:120b",
        model: "gpt-oss:120b",
      };
      setAvailableModels([fallbackModel]);
      setSelectedModel("gpt-oss:120b");
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = input.trim();
    setInput("");

    try {
      const startTime = Date.now();
      
      // Convert conversation history to a prompt string
      // Include previous messages for context
      let prompt = currentInput;
      if (messages.length > 0) {
        const conversationContext = messages
          .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n\n");
        prompt = `${conversationContext}\n\nUser: ${currentInput}\n\nAssistant:`;
      }

      // Try apimodule chat completions first; fallback to provider chatcompletion.
      const modelToUse = selectedModel || availableModels[0]?.model || "gpt-oss:120b";
      const modelString =
        typeof modelToUse === "string" ? modelToUse : (modelToUse as any)?.model || "gpt-oss:120b";

      const toReply = (response: unknown): string => {
        if (typeof response === "string") return response;
        if (!response || typeof response !== "object") return "I'm sorry, I couldn't generate a response.";
        const payload = response as {
          text?: string;
          content?: string;
          message?: string;
          choices?: Array<{ message?: { content?: string }; text?: string; content?: string }>;
          response?: string;
        };
        return (
          payload.choices?.[0]?.message?.content ||
          payload.choices?.[0]?.text ||
          payload.choices?.[0]?.content ||
          payload.text ||
          payload.content ||
          payload.message ||
          payload.response ||
          JSON.stringify(response)
        );
      };

      let reply = "";
      try {
        const response = await moduleAPI.chatCompletions({
          prompt,
          model: modelString,
          stream: false,
        });
        reply = toReply(response);
      } catch {
        const fallback = await providerAPI.chatCompletion({
          prompt,
          model: modelString,
        });
        reply = toReply(fallback);
      }

      const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply.trim(),
        timestamp: new Date(),
        responseTime: `${responseTime}s`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "Failed to get response. Please check if the API server is running and VITE_APIMODULE_URL is configured. Make sure models are available via /v1/provider/list."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(error.message || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const stopVoice = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    voiceSocketRef.current?.close();
    voiceSocketRef.current = null;
    setIsVoiceActive(false);
  }, []);

  const handleMicClick = useCallback(async () => {
    if (isVoiceActive) {
      stopVoice();
      return;
    }
    if (!SARVAM_VOICE_WS_URL) {
      toast.error("Voice is not configured. Set VITE_SARVAM_CHAT_URL for voice.");
      return;
    }

    try {
      const socket = new WebSocket(SARVAM_VOICE_WS_URL);
      voiceSocketRef.current = socket;

      socket.onopen = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
              socket.send(e.data);
            }
          };
          mediaRecorder.start(250);
          setIsVoiceActive(true);
          toast.success("Voice on — speak now");
        } catch (err: any) {
          toast.error(err?.message || "Microphone access denied");
          socket.close();
        }
      };

      socket.onmessage = (event) => {
        try {
          if (typeof event.data !== "string") return;
          const data = JSON.parse(event.data);
          if (data.type === "stt") {
            setInput((prev) => (data.text ? data.text : prev));
          }
          if (data.type === "tts_start") {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "assistant",
                content: data.text || "",
                timestamp: new Date(),
              },
            ]);
            ttsChunksRef.current = [];
          }
          if (data.type === "tts_chunk" && data.chunk) {
            ttsChunksRef.current.push(data.chunk);
          }
          if (data.type === "tts_end") {
            const chunks = ttsChunksRef.current;
            if (chunks.length > 0) {
              const base64 = chunks.join("");
              const audio = new Audio("data:audio/mp3;base64," + base64);
              audio.play().catch(() => {});
            }
            ttsChunksRef.current = [];
          }
          if (data.type === "error") {
            toast.error(data.message || "Voice error");
            stopVoice();
          }
        } catch (_) {}
      };

      socket.onerror = () => {
        toast.error("Voice connection error. Is the backend running on port 3000?");
        stopVoice();
      };
      socket.onclose = () => {
        stopVoice();
      };
    } catch (err: any) {
      toast.error(err?.message || "Failed to start voice");
      setIsVoiceActive(false);
    }
  }, [isVoiceActive, stopVoice]);

  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, [stopVoice]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-white dark:bg-[#050508] transition-colors duration-300">
      {/* PROFESSIONAL BACKGROUND SYSTEM */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0f1016] dark:via-[#050508] dark:to-[#000000] transition-colors duration-300" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-200/30 dark:bg-purple-900/10 blur-[120px] transition-colors duration-300" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-200/30 dark:bg-blue-900/10 blur-[120px] transition-colors duration-300" />
      </div>
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-20 flex flex-col h-full" style={{ minHeight: '100vh' }}>
        {/* Header - Shows only when there are messages */}
        {hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4 border-b border-gray-200/50 dark:border-white/5 bg-white/80 dark:bg-[#0f1016]/80 backdrop-blur-xl transition-colors duration-300"
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
                    onClick={() => router.push("/")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img 
                      src="/logo.png" 
                      alt="AKO.ai Logo" 
                      className="h-auto w-full max-w-[120px] object-contain"
                      animate={{
                        filter: [
                          "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                          "drop-shadow(0 0 15px rgba(255,255,255,0.7))",
                          "drop-shadow(0 0 8px rgba(255,255,255,0.4))"
                        ]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">AEKO</span>
                      <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">AI</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {availableModels.length > 0 && (
                  <div className="relative group">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={loadingModels}
                      className="appearance-none bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-medium px-4 py-2 pr-8 rounded-lg border border-gray-200 dark:border-white/5 focus:outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-300"
                    >
                      {availableModels.map((modelInfo, index) => (
                        <option key={`${modelInfo.model}-${index}`} value={modelInfo.model}>
                          {modelInfo.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-colors duration-300" />
                  </div>
                )}
                <button className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm transition-colors border border-gray-200 dark:border-white/5 flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">
                    {availableAgents.find(a => a.id === selectedAgent)?.name || "Agent"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Messages Area */}
        <div className={`flex-1 overflow-y-auto ${hasMessages ? 'px-4 py-6' : ''}`} style={{ scrollBehavior: 'smooth' }}>
          <div className="max-w-5xl mx-auto">
            {!hasMessages && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex mt-16 flex-col items-center justify-center px-4"
              >
                <div className="text-center space-y-4 mb-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white text-center tracking-tight transition-colors duration-300"
                  >
                    Let's Create
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed transition-colors duration-300"
                  >
                    Start a conversation with your AI assistant. Describe what you want to create, ask questions, or explore creative possibilities.
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Messages List */}
            {hasMessages && (
              <div className="space-y-8 pb-32">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-[#1a1b26] dark:to-[#242636] border border-gray-300 dark:border-white/10 flex items-center justify-center shadow-lg transition-colors duration-300">
                          <img src="/logo.png" alt="AI" className="w-full h-full object-cover object-center scale-[1.65]" />
                        </div>
                      </div>
                    )}
                    <div className={`flex flex-col max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                          {message.role === "assistant" ? "AEKO" : "You"}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-600 transition-colors duration-300">{formatTime(message.timestamp)}</span>
                      </div>
                      <div className={`rounded-2xl px-5 py-3.5 shadow-sm transition-colors duration-300 ${
                        message.role === "user" 
                          ? "bg-gray-900 dark:bg-[#252630] text-white border border-gray-700 dark:border-white/5" 
                          : "bg-transparent text-gray-800 dark:text-gray-200"
                      }`}>
                        <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed">{message.content}</pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-white dark:bg-white/95 shadow-md ring-2 ring-black/10 dark:ring-white/20 flex items-center justify-center transition-colors duration-300 p-1">
                          <img src="/logo.png" alt="AI" className="w-full h-full object-contain object-center" />
                     </div>
                     <div className="flex items-center gap-1.5 px-1 h-9">
                        <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce transition-colors duration-300" />
                        <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce delay-75 transition-colors duration-300" />
                        <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce delay-150 transition-colors duration-300" />
                     </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Container */}
        <motion.div
          className={`z-30 ${hasMessages ? 'relative' : 'absolute inset-x-0'}`}
          initial={false}
          animate={{ y: hasMessages ? 0 : '-50%' }}
          style={{ position: hasMessages ? 'relative' : 'absolute', top: hasMessages ? 'auto' : '50%' }}
        >
          <motion.div
            className={`w-full ${hasMessages ? 'border-t border-gray-200 dark:border-white/5 bg-white/95 dark:bg-[#0f1016]/95 backdrop-blur-xl pb-4 transition-colors duration-300' : ''}`}
            animate={{ paddingTop: hasMessages ? '1rem' : '2rem', paddingBottom: hasMessages ? '1rem' : '2rem' }}
          >
            <motion.div className={`w-full mx-auto px-4 ${hasMessages ? 'max-w-5xl' : 'max-w-4xl'}`}>
              
              {/* Content Type Selectors - Centered above input */}
              {!hasMessages && (
              <div className="flex items-center justify-center gap-3 mb-6">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedContentType(type.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedContentType === type.id
                        ? "bg-purple-600 dark:bg-[#8B5CF6] text-white shadow-lg shadow-purple-900/20 dark:shadow-purple-900/30"
                        : "bg-gray-100 dark:bg-[#1a1b26] text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-[#242630] hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                  >
                    <type.icon className={`w-4 h-4 ${selectedContentType === type.id ? "text-white" : ""}`} />
                    {type.label}
                    {type.isPremium && <Crown className="w-3 h-3 text-amber-400 ml-0.5" />}
                  </button>
                ))}
              </div>
              )}
              {/* Input Wrapper */}
              <motion.div className="relative">
                <motion.div
                  className={`relative rounded-3xl border transition-all duration-300 bg-white dark:bg-[#15161E] border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden`}
                >
                  {/* Top Section: Textarea + Right Actions */}
                  <div className="flex">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={hasMessages ? "Send a message..." : "Describe what you want to create..."}
                      rows={1}
                      className="w-full bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none resize-none overflow-hidden text-[16px] leading-relaxed pt-5 pl-6 pr-32 pb-4 min-h-[60px] max-h-[200px] transition-colors duration-300"
                    />
                    
                    {/* Top Right: Mood Selector + Send Button */}
                    <div className="flex items-start gap-2 pt-3 pr-3">
                      {/* <div className="relative group">
                         <select
                          value={agentMood}
                          onChange={(e) => setAgentMood(e.target.value)}
                          className="appearance-none bg-gray-100 dark:bg-[#242630] text-gray-700 dark:text-gray-300 text-xs font-medium px-4 py-2 pr-8 rounded-lg border border-gray-200 dark:border-white/5 focus:outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2a2c38] transition-colors duration-300"
                        >
                          {agentMoods.map((mood) => (
                            <option key={mood.id} value={mood.label}>{mood.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-colors duration-300" />
                      </div> */}

                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                          input.trim() && !isLoading 
                            ? 'bg-purple-600 dark:bg-[#3b3e4a] text-white hover:bg-purple-700 dark:hover:bg-[#4a4d5a]' 
                            : 'bg-gray-200 dark:bg-[#242630] text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Toolbar */}
                  <div className="flex items-center justify-between px-4 pb-3 pt-2">
                    {/* Left Group */}
                    <div className="flex items-center gap-3">
                       {/* Upload */}
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors duration-300" title="Upload">
                        <Upload className="w-5 h-5" />
                      </button>
                      
                      
                      {/* Purple Plus Button */}
                      <button className="w-8 h-8 rounded-full bg-purple-600 dark:bg-[#8B5CF6] hover:bg-purple-700 dark:hover:bg-[#7C3AED] flex items-center justify-center text-white transition-colors duration-300 shadow-lg shadow-purple-900/30 dark:shadow-purple-900/50">
                        <Plus className="w-5 h-5" />
                      </button>

                      {/* Image/Video Group */}
                      <div className="flex items-center bg-gray-100 dark:bg-[#242630] rounded-lg p-1 border border-gray-200 dark:border-white/5 transition-colors duration-300">
                        <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <div className="w-[1px] h-4 bg-gray-300 dark:bg-white/10 mx-0.5 transition-colors duration-300" />
                        <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                          <Video className="w-4 h-4" />
                        </button>
                      </div>

                       {/* Agents Button */}
                      <button 
                         className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#242630] border border-gray-200 dark:border-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#2a2c38] transition-all duration-300"
                         onClick={() => toast.info("Agent selector")}
                      >
                        <Bot className="w-3.5 h-3.5" />
                        Agents
                        <ChevronDown className="w-3 h-3 text-gray-500 dark:text-gray-400 transition-colors duration-300" />
                      </button>
                    </div>
                    
                    {/* Right Group */}
                    {/* Right Group */}
                    <div className="flex items-center gap-1 sm:gap-2 px-1">
                      {/* Mic Button - Voice agent (STT -> LLM -> TTS) */}
                      <button
                        type="button"
                        onClick={handleMicClick}
                        className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${
                          isVoiceActive
                            ? "bg-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500/30"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                        aria-label="Voice Input"
                        title={isVoiceActive ? "Stop voice" : "Start voice"}
                      >
                        <Mic className="w-5 h-5" />
                      </button>

                      {/* Enhance Button */}
                      <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 active:scale-95 transition-all duration-200" aria-label="Enhance Prompt" title="Enhance">
                        <Sparkles className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentLLMPage;