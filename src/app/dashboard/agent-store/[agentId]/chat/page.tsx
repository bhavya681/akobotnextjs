"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  ArrowLeft,
  Loader2,
  User,
  Paperclip,
  Mic,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  X,
  FileText,
  ImageIcon,
  Copy,
  Check,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { customAgentAPI, type CustomAgent } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: "file" | "image"; url?: string }[];
  feedback?: "up" | "down" | null;
}

const SESSION_KEY = "agent-chat-session";
const ACCEPT_FILES = ".pdf,.docx,.txt,.md,.csv,.xlsx,.tsv";
const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp";

function getOrCreateSessionId(agentId: string): string {
  if (typeof window === "undefined") return `session-${Date.now()}`;
  const key = `${SESSION_KEY}-${agentId}`;
  let session = sessionStorage.getItem(key);
  if (!session) {
    session = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, session);
  }
  return session;
}

function TypingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/60"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = (params?.agentId ?? "") as string;
  const [agent, setAgent] = useState<CustomAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [attachedImages, setAttachedImages] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!agentId) return;
    sessionIdRef.current = getOrCreateSessionId(agentId);
    customAgentAPI
      .get(agentId)
      .then((a) => {
        setAgent(a);
        if (a.welcomeMessage) {
          setMessages([
            {
              id: `welcome-${Date.now()}`,
              role: "assistant",
              content: a.welcomeMessage,
              timestamp: new Date(),
            },
          ]);
        }
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Agent not found.";
        toast.error("Failed to load agent", { description: msg });
        if (msg.toLowerCase().includes("session") || msg.toLowerCase().includes("sign in")) {
          router.push("/auth/sign-in");
        } else {
          router.push("/dashboard/agent-store");
        }
      })
      .finally(() => setLoading(false));
  }, [agentId, router]);

  useEffect(() => {
    if (!agentId || bootstrapped || loading || !agent) return;
    customAgentAPI
      .bootstrap(agentId)
      .then(() => setBootstrapped(true))
      .catch(() => {});
  }, [agentId, bootstrapped, loading, agent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && attachedFiles.length === 0 && attachedImages.length === 0) || sending || !agentId) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text || "(attachments only)",
      timestamp: new Date(),
      attachments: [
        ...attachedFiles.map((f) => ({ name: f.name, type: "file" as const })),
        ...attachedImages.map((f) => ({
          name: f.name,
          type: "image" as const,
          url: URL.createObjectURL(f),
        })),
      ],
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const filesToSend = [...attachedFiles];
    const imagesToSend = [...attachedImages];
    setAttachedFiles([]);
    setAttachedImages([]);
    setSending(true);

    const assistantPlaceholder: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantPlaceholder]);
    setStreamingMsgId(assistantPlaceholder.id);

    try {
      let fullContent = "";
      await customAgentAPI.chatStream(agentId, {
        query: text || "Please analyze the attached files/images.",
        session_id: sessionIdRef.current,
        files: filesToSend.length > 0 ? filesToSend : undefined,
        images: imagesToSend.length > 0 ? imagesToSend : undefined,
        onChunk: (chunk) => {
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantPlaceholder.id ? { ...m, content: fullContent } : m
            )
          );
        },
        onDone: () => {
          setSending(false);
          setStreamingMsgId(null);
        },
        onError: (e) => {
          setSending(false);
          setStreamingMsgId(null);
          toast.error("Stream error", { description: e.message });
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantPlaceholder.id ? { ...m, content: `Error: ${msg}` } : m
        )
      );
      setStreamingMsgId(null);
      toast.error("Chat failed", { description: msg });
      setSending(false);
      if (msg.toLowerCase().includes("session") || msg.toLowerCase().includes("sign in")) {
        router.push("/auth/sign-in");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const list = Array.from(files);
    const docs = list.filter((f) => !f.type.startsWith("image/"));
    const imgs = list.filter((f) => f.type.startsWith("image/"));
    setAttachedFiles((prev) => [...prev, ...docs]);
    setAttachedImages((prev) => [...prev, ...imgs]);
    e.target.value = "";
  };

  const removeAttachment = (idx: number, isImage: boolean) => {
    if (isImage) setAttachedImages((p) => p.filter((_, i) => i !== idx));
    else setAttachedFiles((p) => p.filter((_, i) => i !== idx));
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (audioChunksRef.current.length === 0) return;
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice.webm", { type: "audio/webm" });
        try {
          const res = await customAgentAPI.transcribe(agentId, file);
          const text = res?.text ?? res?.transcription ?? "";
          if (text) setInput((prev) => (prev ? `${prev} ${text}` : text));
          else toast.info("No speech detected", { description: "Try speaking clearly or use a supported format (WAV, MP3, M4A)." });
        } catch {
          toast.error("Transcription failed", { description: "Use WAV, MP3, or M4A for best results." });
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const handleSpeak = async (msg: ChatMessage) => {
    if (!msg.content) return;
    if (speakingMsgId === msg.id) {
      playingAudioRef.current?.pause();
      playingAudioRef.current = null;
      setSpeakingMsgId(null);
      return;
    }
    setSpeakingMsgId(msg.id);
    try {
      const res = await customAgentAPI.tts(agentId, { text: msg.content });
      const url = res?.url ?? res?.audio_url;
      if (!url || typeof url !== "string") throw new Error("No audio URL in response");
      const audio = new Audio(url);
      playingAudioRef.current = audio;
      audio.onended = () => {
        playingAudioRef.current = null;
        setSpeakingMsgId(null);
      };
      audio.onerror = () => {
        playingAudioRef.current = null;
        setSpeakingMsgId(null);
        toast.error("Playback failed");
      };
      await audio.play();
    } catch {
      setSpeakingMsgId(null);
      toast.error("Text-to-speech failed");
    }
  };

  const handleFeedback = async (msg: ChatMessage, rating: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, feedback: rating } : m))
    );
    try {
      await customAgentAPI.feedback(agentId, {
        session_id: sessionIdRef.current,
        rating,
        metadata: { message_id: msg.id },
      });
      toast.success("Thanks for your feedback!");
    } catch {
      toast.error("Could not submit feedback");
    }
  };

  const handleCopy = async (msg: ChatMessage) => {
    if (!msg.content) return;
    await navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    try {
      const m = await customAgentAPI.metrics(agentId);
      setMetrics(m);
    } catch {
      toast.error("Failed to load metrics");
    } finally {
      setMetricsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex items-center justify-center shadow-lg"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </motion.div>
        <p className="mt-6 text-sm text-muted-foreground font-medium">Loading agent...</p>
      </div>
    );
  }

  const isWelcomeOnly = messages.length === 1 && messages[0]?.role === "assistant";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/5">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 border-b border-border/40 bg-background/90 backdrop-blur-xl shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/agent-store")}
          className="rounded-xl shrink-0 hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/25 to-purple-500/25 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold truncate text-foreground">{agent?.name ?? "Agent"}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <Popover open={metricsOpen} onOpenChange={(o) => { setMetricsOpen(o); if (o && !metrics) fetchMetrics(); }}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl shrink-0" title="View metrics">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Agent Metrics</h4>
                  {metricsLoading ? (
                    <div className="flex items-center gap-2 py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : metrics ? (
                    <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-auto max-h-48 font-mono">
                      {JSON.stringify(metrics, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">No metrics available.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full">
        {isWelcomeOnly && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-purple-500/15 border border-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Start a conversation. Attach files, use voice input, or ask anything.
            </p>
          </motion.div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  msg.role === "user"
                    ? "bg-primary/15 border border-primary/25"
                    : "bg-muted/60 border border-border/50"
                )}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-primary" />
                ) : (
                  <Bot className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "flex-1 min-w-0 max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground border-primary/30 rounded-tr-md"
                    : "bg-card border-border/50 rounded-tl-md"
                )}
              >
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {msg.attachments.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {a.type === "image" && a.url && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/50 border border-border/50">
                            <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs",
                            msg.role === "user" ? "bg-white/20" : "bg-muted/80"
                          )}
                        >
                          {a.type === "image" && !a.url && <ImageIcon className="w-3 h-3" />}
                          {a.type === "file" && <FileText className="w-3 h-3" />}
                          {a.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {msg.content ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                    {streamingMsgId === msg.id && (
                      <span className="inline-block w-2 h-4 ml-0.5 bg-primary animate-pulse align-middle rounded-sm" />
                    )}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 py-1">
                    <TypingDots />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                )}
                {msg.role === "assistant" && msg.content && (
                  <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/30">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => handleCopy(msg)}
                      title="Copy"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => handleSpeak(msg)}
                      title="Listen"
                    >
                      {speakingMsgId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-7 w-7 rounded-lg", msg.feedback === "up" && "text-emerald-500")}
                      onClick={() => handleFeedback(msg, "up")}
                      title="Good response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-7 w-7 rounded-lg", msg.feedback === "down" && "text-red-500")}
                      onClick={() => handleFeedback(msg, "down")}
                      title="Poor response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments preview */}
      {(attachedFiles.length > 0 || attachedImages.length > 0) && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 max-w-3xl mx-auto w-full">
          {attachedFiles.map((f, i) => (
            <span
              key={`f-${i}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/80 text-xs border border-border/50"
            >
              <FileText className="w-3.5 h-3.5" />
              {f.name}
              <button
                onClick={() => removeAttachment(i, false)}
                className="ml-0.5 rounded p-0.5 hover:bg-destructive/20"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {attachedImages.map((f, i) => (
            <span
              key={`i-${i}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/80 text-xs border border-border/50"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {f.name}
              <button
                onClick={() => removeAttachment(i, true)}
                className="ml-0.5 rounded p-0.5 hover:bg-destructive/20"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 p-4 border-t border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={`${ACCEPT_FILES},${ACCEPT_IMAGES}`}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            title="Attach files or images"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 h-12 px-4 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm placeholder:text-muted-foreground transition-colors"
            disabled={sending}
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-11 w-11 rounded-xl shrink-0 transition-colors",
              isRecording && "bg-red-500/20 text-red-500"
            )}
            onClick={handleVoiceInput}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-xl shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            onClick={handleSend}
            disabled={
              (!input.trim() && attachedFiles.length === 0 && attachedImages.length === 0) ||
              sending
            }
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Supports PDF, DOCX, TXT, images. Use voice for transcription.
        </p>
      </div>
    </div>
  );
}
