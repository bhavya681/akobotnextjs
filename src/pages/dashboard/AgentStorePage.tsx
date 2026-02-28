"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreVertical,
  ExternalLink,
  Code,
  Bot,
  FileText,
  ArrowLeft,
  Phone,
  Pencil,
  Download,
  Paperclip,
  Send,
  Loader2,
  CheckCircle2,
  Globe,
  Database,
  Settings,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Star,
  Filter,
  Grid,
  List,
  ChevronRight,
  Users,
  Clock,
  Upload,
  Link,
  FileUp,
  BrainCircuit,
  PlayCircle,
  X,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { crawlAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "UNPUBLISHED" | "PUBLISHED" | "DRAFT";
  pricing: "FREE" | "PAID" | "PREMIUM";
  icon?: string;
  createdAt: Date;
  tags: string[];
  interactions: number;
  lastActive: Date;
}

const AgentStorePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlSuccess, setCrawlSuccess] = useState(false);
  const [crawledData, setCrawledData] = useState<{
    url: string;
    title: string;
    description: string;
    favicon: string | null;
    logo: string | null;
  } | null>(null);
  const [agentName, setAgentName] = useState("My AI Assistant");
  const [agentDescription, setAgentDescription] = useState("");
  const [llmModel, setLlmModel] = useState("gpt-4o-mini");
  const [agentType, setAgentType] = useState("chat");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [currentStep, setCurrentStep] = useState<"create" | "knowledge">("create");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [knowledgeTab, setKnowledgeTab] = useState<"website" | "files" | "integrations">("website");
  const [knowledgeStepCrawling, setKnowledgeStepCrawling] = useState(false);
  const [knowledgeStepCrawledSite, setKnowledgeStepCrawledSite] = useState<{ title: string; url: string; description: string } | null>(null);
  const [knowledgeStepPages, setKnowledgeStepPages] = useState<Array<{ url: string; title: string; description: string }>>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // New State for Chat Drawer and Input
  const [activeChatAgent, setActiveChatAgent] = useState<Agent | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  // Agent Superpowers Modal State
  const [isSuperpowersModalOpen, setIsSuperpowersModalOpen] = useState(false);
  const [selectedAgentForCustomize, setSelectedAgentForCustomize] = useState<Agent | null>(null);
  const [superpowersTab, setSuperpowersTab] = useState<"website" | "files" | "integrations">("website");
  
  // Superpowers Website Knowledge State
  const [superpowersWebsiteUrl, setSuperpowersWebsiteUrl] = useState("");
  const [isSuperpowersCrawling, setIsSuperpowersCrawling] = useState(false);
  const [superpowersCrawledSite, setSuperpowersCrawledSite] = useState<{
    url: string;
    title: string;
    description: string;
    favicon: string | null;
    logo: string | null;
  } | null>(null);
  const [superpowersCrawledUrls, setSuperpowersCrawledUrls] = useState<Array<{url: string; title: string; isParent?: boolean}>>([]);
  const [superpowersSelectedUrls, setSuperpowersSelectedUrls] = useState<string[]>([]);
  const [superpowersUrlSearchQuery, setSuperpowersUrlSearchQuery] = useState("");
  
  // Superpowers Knowledge Files State
  const [superpowersUploadedFiles, setSuperpowersUploadedFiles] = useState<Array<{name: string; size: string}>>([]);
  
  // Superpowers Integrations State
  const [superpowersSelectedIntegrations, setSuperpowersSelectedIntegrations] = useState<string[]>([]);
  const [superpowersIntegrationSearchQuery, setSuperpowersIntegrationSearchQuery] = useState("");

  const integrations = [
    {
      id: "fortinet-fortigate",
      name: "fortinet-fortigate",
      displayName: "FORTINET - MCP Enabled",
      category: "NETWORKING_FIREWALL",
      tools: 33,
      icon: "🔴",
    },
    {
      id: "proxmox-ve",
      name: "proxmox-ve",
      displayName: "PROXMOX - MCP Enabled",
      category: "VIRTUALIZATION",
      tools: 38,
      icon: "🟠",
    },
    {
      id: "nexus-epm",
      name: "nexus-epm",
      displayName: "NEXUS_EPM - MCP Enabled",
      category: "RMM",
      tools: 17,
      icon: "🔵",
    },
  ];

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Cnergee",
      description: "Cnergee Technologies provides integrated network security products—SD-WAN, NGFW, Managed WiFi, and Endpoint Security—built in...",
      status: "PUBLISHED",
      pricing: "PREMIUM",
      createdAt: new Date(),
      tags: ["Security", "Enterprise", "AI"],
      interactions: 1245,
      lastActive: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      name: "Instagram",
      description: "Social media assistant for content creation, scheduling, and analytics across multiple platforms with AI-powered insights.",
      status: "PUBLISHED",
      pricing: "PAID",
      createdAt: new Date(),
      tags: ["Social", "Marketing", "Analytics"],
      interactions: 8920,
      lastActive: new Date(Date.now() - 1800000),
    },
    {
      id: "3",
      name: "Yamaha Motor India",
      description: "Presenting the new & best in the class - ✓ Mileage Scooters ✓ Performance Motorcycles ✓ Superbikes from Yamaha....",
      status: "PUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
      tags: ["Automotive", "Sales", "Support"],
      interactions: 567,
      lastActive: new Date(Date.now() - 7200000),
    },
    {
      id: "4",
      name: "Hi Focus",
      description: "Explore advanced CCTV solutions from the most reliable and trusted CCTV camera brand in India, Hi Focus. Shop for HD CCTV Cameras, IP, PTZ...",
      status: "DRAFT",
      pricing: "PAID",
      createdAt: new Date(),
      tags: ["Security", "Hardware", "IoT"],
      interactions: 234,
      lastActive: new Date(Date.now() - 86400000),
    },
    {
      id: "5",
      name: "Aavas Financiers Ltd",
      description: "Aavas Financiers Limited - a leading housing loan finance company in India offering various types of home loans at attractive interest rates...",
      status: "PUBLISHED",
      pricing: "PREMIUM",
      createdAt: new Date(),
      tags: ["Finance", "Loans", "Banking"],
      interactions: 1876,
      lastActive: new Date(Date.now() - 3600000),
    },
    {
      id: "6",
      name: "Scogo Cloud",
      description: "This agent helps the user to raise support requests on the Scogo Cloud Platform with automated troubleshooting and solution suggestions.",
      status: "PUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
      tags: ["Cloud", "Support", "DevOps"],
      interactions: 3452,
      lastActive: new Date(Date.now() - 900000),
    },
    {
      id: "7",
      name: "Globalnet",
      description: "As a market leader in Myanmar, our suite of ICT Solutions is backed up by an extensive data network and infrastructure that spans key...",
      status: "PUBLISHED",
      pricing: "PAID",
      createdAt: new Date(),
      tags: ["Telecom", "Infrastructure", "Enterprise"],
      interactions: 678,
      lastActive: new Date(Date.now() - 14400000),
    },
    {
      id: "8",
      name: "IIT Roorkee",
      description: "IIT Roorkee primarily functions as a leading technical research university, offering undergraduate, postgraduate, and doctoral...",
      status: "DRAFT",
      pricing: "FREE",
      createdAt: new Date(),
      tags: ["Education", "Research", "AI"],
      interactions: 123,
      lastActive: new Date(Date.now() - 172800000),
    },
  ]);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).filter(agent => 
    selectedFilter === "all" || 
    agent.status.toLowerCase() === selectedFilter.toLowerCase() ||
    agent.pricing.toLowerCase() === selectedFilter.toLowerCase()
  );

  const handleCrawlWebsite = async () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    setIsCrawling(true);
    setCrawlSuccess(false);
    setCrawledData(null);

    try {
      const urlToCrawl = normalizeUrl(websiteUrl);
      const data = await crawlAPI.crawlWebsite(urlToCrawl);

      if (data.success && data.data) {
        setCrawledData(data.data);
        setCrawlSuccess(true);
        setAgentName(data.data.title || "My AI Assistant");
        setAgentDescription(data.data.description || "");
        setLogoUrl(data.data.logo || "");
        setFaviconUrl(data.data.favicon || "");
        toast.success("Website crawled successfully!", {
          description: "Agent details have been auto-filled.",
          icon: "🌐",
        });
      } else {
        toast.error("Failed to crawl website", {
          description: data.message || "Please check the URL and try again.",
        });
        setCrawlSuccess(false);
      }
    } catch (error: any) {
      console.error("Crawl error:", error);
      toast.error("Failed to crawl website", {
        description: error.message || "Make sure the backend is running.",
      });
      setCrawlSuccess(false);
    } finally {
      setIsCrawling(false);
    }
  };

  useEffect(() => {
    if (!isCreateDialogOpen) {
      setWebsiteUrl("");
      setIsCrawling(false);
      setCrawlSuccess(false);
      setCrawledData(null);
      setAgentName("My AI Assistant");
      setAgentDescription("");
      setLogoUrl("");
      setFaviconUrl("");
      setKnowledgeStepCrawling(false);
      setKnowledgeStepCrawledSite(null);
      setKnowledgeStepPages([]);
    }
  }, [isCreateDialogOpen]);

  // Auto-crawl when user pastes or enters a valid website URL (debounced)
  useEffect(() => {
    if (!isCreateDialogOpen || currentStep !== "create" || !websiteUrl.trim()) return;
    if (!isValidUrl(websiteUrl)) return;

    const timeoutId = setTimeout(() => {
      handleCrawlWebsite();
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [websiteUrl, isCreateDialogOpen, currentStep]);

  const handleNext = async () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }
    setCurrentStep("knowledge");
    const urlToCrawl = normalizeUrl(websiteUrl);
    setKnowledgeStepCrawling(true);
    setKnowledgeStepPages([]);
    setKnowledgeStepCrawledSite(null);
    try {
      const data = await crawlAPI.crawlWebsite(urlToCrawl);
      if (data.success && data.data) {
        const baseUrl = (data.data.url || urlToCrawl).replace(/\/$/, "");
        setKnowledgeStepCrawledSite({
          title: data.data.title || new URL(urlToCrawl).hostname,
          url: data.data.url || urlToCrawl,
          description: data.data.description || "",
        });
        const pages = [
          { url: baseUrl + "/", title: data.data.title || "Homepage", description: "Main website content" },
          { url: baseUrl + "/about", title: "About Us", description: "Company information" },
          { url: baseUrl + "/products", title: "Products", description: "Product catalog" },
          { url: baseUrl + "/contact", title: "Contact", description: "Contact information" },
          { url: baseUrl + "/privacy-policy", title: "Privacy Policy", description: "Privacy policy" },
          { url: baseUrl + "/terms", title: "Terms", description: "Terms of service" },
          { url: baseUrl + "/support", title: "Support", description: "Support & help" },
        ];
        setKnowledgeStepPages(pages);
        setSelectedUrls([baseUrl + "/"]);
        toast.success("Website crawled", { description: "Select pages to include in your agent knowledge." });
      } else {
        const baseUrl = urlToCrawl.replace(/\/$/, "");
        setKnowledgeStepPages([
          { url: baseUrl + "/", title: "Homepage", description: "Main website content" },
          { url: baseUrl + "/about", title: "About Us", description: "Company information" },
          { url: baseUrl + "/products", title: "Products", description: "Product catalog" },
          { url: baseUrl + "/contact", title: "Contact", description: "Contact information" },
        ]);
        setSelectedUrls([baseUrl + "/"]);
      }
    } catch (err: any) {
      const baseUrl = urlToCrawl.replace(/\/$/, "");
      setKnowledgeStepPages([
        { url: baseUrl + "/", title: "Homepage", description: "Main website content" },
        { url: baseUrl + "/about", title: "About Us", description: "Company information" },
        { url: baseUrl + "/products", title: "Products", description: "Product catalog" },
        { url: baseUrl + "/contact", title: "Contact", description: "Contact information" },
      ]);
      setSelectedUrls([baseUrl + "/"]);
      toast.error("Crawl failed", { description: "Showing suggested pages. You can still select them." });
    } finally {
      setKnowledgeStepCrawling(false);
    }
  };

  const handleBack = () => {
    setCurrentStep("create");
  };

  const normalizeUrl = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const isValidUrl = (url: string) => {
    const toTest = normalizeUrl(url);
    if (!toTest) return false;
    try {
      new URL(toTest);
      return true;
    } catch {
      return false;
    }
  };

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "DRAFT": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  const getPricingColor = (pricing: Agent["pricing"]) => {
    switch (pricing) {
      case "PREMIUM": return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      case "PAID": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default: return "bg-green-500/20 text-green-500 border-green-500/30";
    }
  };

  // Superpowers Modal Handlers
  const handleSuperpowersCrawlWebsite = async () => {
    if (!superpowersWebsiteUrl.trim()) return;
    const urlToCrawl = normalizeUrl(superpowersWebsiteUrl);
    setIsSuperpowersCrawling(true);
    setSuperpowersCrawledSite(null);
    setSuperpowersCrawledUrls([]);
    setSuperpowersSelectedUrls([]);
    try {
      const data = await crawlAPI.crawlWebsite(urlToCrawl);
      if (data.success && data.data) {
        setSuperpowersCrawledSite({
          url: data.data.url,
          title: data.data.title || new URL(urlToCrawl).hostname,
          description: data.data.description || "",
          favicon: data.data.favicon || null,
          logo: data.data.logo || null,
        });
        const baseUrl = data.data.url.replace(/\/$/, "");
        const suggested = [
          { url: baseUrl + "/", title: data.data.title || "Homepage", isParent: true },
          { url: baseUrl + "/about", title: "About" },
          { url: baseUrl + "/contact", title: "Contact" },
          { url: baseUrl + "/privacy-policy", title: "Privacy Policy" },
          { url: baseUrl + "/terms", title: "Terms" },
          { url: baseUrl + "/support", title: "Support" },
        ];
        setSuperpowersCrawledUrls(suggested);
        setSuperpowersSelectedUrls([baseUrl + "/"]);
        toast.success("Website crawled", { description: "Website KB is ready. Select pages to include." });
      } else {
        toast.error("Crawl failed", { description: data.message || "Could not fetch website." });
      }
    } catch (err: any) {
      toast.error("Crawl failed", { description: err.message || "Check URL and try again." });
    } finally {
      setIsSuperpowersCrawling(false);
    }
  };
  
  const handleSuperpowersToggleUrl = (url: string) => {
    setSuperpowersSelectedUrls(prev => 
      prev.includes(url) 
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };
  
  const handleSuperpowersFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`
      }));
      setSuperpowersUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleSuperpowersToggleIntegration = (id: string) => {
    setSuperpowersSelectedIntegrations(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const superpowersFilteredUrls = superpowersCrawledUrls.filter(url => 
    url.title.toLowerCase().includes(superpowersUrlSearchQuery.toLowerCase()) ||
    url.url.toLowerCase().includes(superpowersUrlSearchQuery.toLowerCase())
  );
  
  const superpowersFilteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(superpowersIntegrationSearchQuery.toLowerCase()) ||
    integration.displayName.toLowerCase().includes(superpowersIntegrationSearchQuery.toLowerCase()) ||
    integration.category.toLowerCase().includes(superpowersIntegrationSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 via-muted/5 p-4 md:p-6 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center cursor-pointer"
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
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight truncate">
                Agent Store
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                Discover and manage your AI agents
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Added: Extra Create Agent Button */}
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 border-primary/20 hover:bg-primary/5 text-primary"
            >
              <Plus className="w-4 h-4" />
              New Agent
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Coming soon!")}
              className="gap-2 border-border/50 hover:border-primary/50"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            
            <div className="flex items-center border border-border/50 rounded-lg p-1 bg-card/50">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "grid" 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "list" 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
            >
              <Sparkles className="w-4 h-4" />
              Create Agent
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <span className="text-muted-foreground whitespace-nowrap">
              {agents.filter(a => a.status === "PUBLISHED").length} Active
            </span>
          </div>
          <div className="hidden sm:block text-muted-foreground">•</div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground whitespace-nowrap">
              {agents.reduce((acc, a) => acc + a.interactions, 0).toLocaleString()} Interactions
            </span>
          </div>
        </div>

        {/* Search and Quick Filters – single row, search beside Free */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="relative flex-1 min-w-[200px] sm:min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents, tags, or descriptions..."
              className="w-full pl-9 pr-9 sm:pr-10 py-2.5 sm:py-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm sm:text-base shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Badge
            variant={selectedFilter === "all" ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedFilter("all")}
          >
            All Agents
          </Badge>
          <Badge
            variant={selectedFilter === "published" ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedFilter("published")}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
            Published
          </Badge>
          <Badge
            variant={selectedFilter === "premium" ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedFilter("premium")}
          >
            <Star className="w-3 h-3 mr-1" />
            Premium
          </Badge>
          <Badge
            variant={selectedFilter === "free" ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedFilter("free")}
          >
            Free
          </Badge>
        </div>
      </div>

      {/* Agent Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
              : "space-y-3 sm:space-y-4"
          )}
        >
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn(
                viewMode === "grid" 
                  ? "h-full"
                  : "flex items-center p-4"
              )}
            >
              <Card className={cn(
                "group relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 flex flex-col",
                viewMode === "grid" 
                  ? "hover:scale-[1.02]" 
                  : "flex-1"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <CardHeader className="pb-2 pt-4 px-4 flex-shrink-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 flex items-center justify-center">
                          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start gap-1.5">
                          <CardTitle className="text-sm sm:text-base font-bold truncate group-hover:text-primary transition-colors leading-tight">
                            {agent.name}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[9px] sm:text-[10px] px-1 py-0 font-medium shrink-0",
                              getStatusColor(agent.status)
                            )}
                          >
                            {agent.status}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[9px] sm:text-[10px] px-1 py-0 font-medium shrink-0",
                              getPricingColor(agent.pricing)
                            )}
                          >
                            {agent.pricing}
                          </Badge>
                          <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-muted-foreground shrink-0">
                            <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">
                              {Math.floor((Date.now() - agent.lastActive.getTime()) / 3600000)}h ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 hover:bg-muted relative z-10 flex-shrink-0"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 z-[100]">
                        <DropdownMenuItem
                          onSelect={() => {
                            console.log("Customize clicked for agent:", agent.name);
                            setSelectedAgentForCustomize(agent);
                            setSuperpowersTab("website");
                            setIsSuperpowersModalOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Customize
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.info("Edit Agent feature coming soon!");
                          }}
                          className="cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.info("Share Agent feature coming soon!");
                          }}
                          className="cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Share Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.info("View Code feature coming soon!");
                          }}
                          className="cursor-pointer"
                        >
                          <Code className="w-4 h-4 mr-2" />
                          View Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onSelect={() => {
                            toast.error("Delete Agent feature coming soon!");
                          }}
                          className="text-destructive cursor-pointer"
                        >
                          Delete Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {agent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 overflow-hidden">
                      {agent.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] bg-secondary/50 text-muted-foreground border border-border/50 font-medium truncate max-w-[100px] sm:max-w-[120px]"
                          title={tag}
                        >
                          {tag}
                        </span>
                      ))}
                      {agent.tags.length > 3 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] bg-secondary/50 text-muted-foreground border border-border/50 font-medium">
                          +{agent.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className={cn(
                  "flex-1 flex flex-col overflow-hidden px-4 pb-3",
                  viewMode === "list" ? "flex-1" : ""
                )}>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-snug mb-2 flex-shrink-0">
                    {agent.description}
                  </CardDescription>
                  
                  <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs min-w-0">
                      <div className="flex items-center gap-1 min-w-0">
                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold text-foreground truncate">
                          {agent.interactions.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground hidden sm:inline truncate">
                          interactions
                        </span>
                        <span className="text-muted-foreground sm:hidden truncate">
                          int.
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-primary/10 flex-shrink-0"
                        onClick={() => toast.info(`Sharing ${agent.name}`)}
                      >
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1 text-[10px] sm:text-xs px-2 h-6 sm:h-7 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 flex-shrink-0"
                        onClick={() => setActiveChatAgent(agent)}
                      >
                        <PlayCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Interact</span>
                        <span className="sm:hidden">Chat</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>

                {viewMode === "grid" && (
                  <CardFooter className="pt-2 pb-3 px-4 flex-shrink-0">
                    <Progress value={Math.min(agent.interactions / 100, 100)} className="h-1" />
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Create Agent Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) {
          setCurrentStep("create");
          setSelectedUrls([]);
          setKnowledgeTab("website");
        }
      }}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 gap-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/5 border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {currentStep === "create" ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex h-full relative z-10"
              >
                <div className="w-full lg:w-2/5 p-6 md:p-8 overflow-y-auto border-r border-border/50 bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        Create New Agent
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Build your AI assistant in minutes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-foreground">
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Website URL
                          <span className="text-destructive">*</span>
                        </span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group flex-1 min-w-0">
                          <Input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://your-website.com"
                            className="w-full h-12 pl-4 pr-12 rounded-xl bg-card border-2 border-border/50 focus:border-primary focus:ring-0 transition-all group-hover:border-primary/50"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isCrawling && (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            )}
                            {crawlSuccess && !isCrawling && (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0 sm:min-w-0">
                          <div className="space-y-1.5 flex-1 sm:flex-initial sm:w-[140px]">
                            <label className="block text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <BrainCircuit className="w-3.5 h-3.5" />
                                LLM Model
                              </span>
                            </label>
                            <Select value={llmModel} onValueChange={setLlmModel}>
                              <SelectTrigger className="h-12 rounded-xl bg-card border-2 border-border/50 focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder="Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
                                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5 flex-1 sm:flex-initial sm:w-[130px]">
                            <label className="block text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Bot className="w-3.5 h-3.5" />
                                Agent Type
                              </span>
                            </label>
                            <Select value={agentType} onValueChange={setAgentType}>
                              <SelectTrigger className="h-12 rounded-xl bg-card border-2 border-border/50 focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="chat">Chat</SelectItem>
                                <SelectItem value="support">Support</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="qa">Q&A</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        Paste or enter a valid URL — details are fetched automatically after a moment
                      </p>
                      {crawledData && (
                        <div className="rounded-xl border border-border/50 bg-card/50 dark:bg-white/[0.03] p-4 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            Website details fetched
                          </p>
                          <div className="flex items-start gap-3">
                            {(crawledData.favicon || crawledData.logo) && (
                              <img
                                src={crawledData.logo || crawledData.favicon || ''}
                                alt=""
                                className="w-10 h-10 rounded-lg object-contain bg-muted/50"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground truncate">{crawledData.title}</p>
                              {crawledData.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{crawledData.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                          Agent Name
                        </label>
                        <Input
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="e.g., Customer Support AI"
                          className="h-12 rounded-xl bg-card border-2 border-border/50 focus:border-primary"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                          Description
                        </label>
                        <Textarea
                          value={agentDescription}
                          onChange={(e) => setAgentDescription(e.target.value)}
                          placeholder="What does your agent do? What problems does it solve?"
                          rows={3}
                          className="rounded-xl bg-card border-2 border-border/50 focus:border-primary resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!websiteUrl.trim() || !isValidUrl(websiteUrl)}
                      className={cn(
                        "rounded-xl px-8 gap-2 transition-all",
                        websiteUrl.trim() && isValidUrl(websiteUrl)
                          ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
                          : "opacity-50 cursor-not-allowed"
                      )}
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="hidden lg:flex flex-1 flex-col p-6 md:p-8 bg-gradient-to-br from-muted/20 to-background/80">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
                    <p className="text-sm text-muted-foreground">See how your agent will appear</p>
                  </div>

                  <div className="flex-1 rounded-2xl border-2 border-border/50 overflow-hidden bg-card shadow-2xl">
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {(faviconUrl || logoUrl) ? (
                                <img
                                  src={logoUrl || faviconUrl || ''}
                                  alt=""
                                  className="w-10 h-10 rounded-xl object-contain bg-muted/50 border border-border/50"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center", (faviconUrl || logoUrl) && "hidden")}>
                                <span className="text-white font-bold">AI</span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{agentName || "My Assistant"}</h4>
                              <p className="text-xs text-muted-foreground">Always online • Ready to help</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-4 space-y-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white">AI</span>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl rounded-tl-none p-4">
                              <p className="text-sm">
                                Hello! I'm {agentName || "your AI assistant"}. How can I help you today?
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 ml-1">Just now</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5 text-muted-foreground" />
                          </button>
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 h-12 px-4 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:border-primary text-sm"
                            disabled
                          />
                          <button className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-90 transition-opacity">
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full min-h-0 flex flex-col relative z-10"
              >
                <div className="flex flex-col h-full min-h-0 bg-background/80 backdrop-blur-sm">
                  <div className="p-6 border-b border-border/50 shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                          Enhance Your Agent
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add knowledge and capabilities to make your agent smarter
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="rounded-full"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-6">
                    <Tabs value={knowledgeTab} onValueChange={(v: any) => setKnowledgeTab(v)} className="w-full">
                      <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="website" className="gap-2 py-3">
                          <Globe className="w-4 h-4" />
                          Website Knowledge
                        </TabsTrigger>
                        <TabsTrigger value="files" className="gap-2 py-3">
                          <Database className="w-4 h-4" />
                          Files & Documents
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="gap-2 py-3">
                          <Settings className="w-4 h-4" />
                          Integrations
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="website" className="space-y-6 mt-0">
                        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-foreground">Website Knowledge Base</h4>
                              <p className="text-sm text-muted-foreground">
                                {knowledgeStepCrawling
                                  ? "Crawling website…"
                                  : "Select pages to include in your agent knowledge"}
                              </p>
                            </div>
                            {!knowledgeStepCrawling && (
                              <Badge variant="secondary">
                                {selectedUrls.length} selected
                              </Badge>
                            )}
                          </div>

                          {knowledgeStepCrawling && (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                              <Loader2 className="w-10 h-10 animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground">Fetching website details and pages…</p>
                            </div>
                          )}

                          {!knowledgeStepCrawling && knowledgeStepPages.length > 0 && (
                            <div className="space-y-3">
                              {knowledgeStepPages.map((item, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:border-primary/50",
                                    selectedUrls.includes(item.url)
                                      ? "bg-primary/5 border-primary/30"
                                      : "bg-card border-border/50"
                                  )}
                                  onClick={() => {
                                    setSelectedUrls(prev =>
                                      prev.includes(item.url)
                                        ? prev.filter(u => u !== item.url)
                                        : [...prev, item.url]
                                    );
                                  }}
                                >
                                  <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                    selectedUrls.includes(item.url)
                                      ? "bg-primary border-primary"
                                      : "border-border"
                                  )}>
                                    {selectedUrls.includes(item.url) && (
                                      <CheckCircle2 className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium">{item.title}</h5>
                                      <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                    <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Advanced Crawling</p>
                              <p className="text-sm text-muted-foreground">Crawl up to 100 pages automatically</p>
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </TabsContent>

                      <TabsContent value="files" className="space-y-6">
                        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                              <FileUp className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold mb-2">Upload Knowledge Files</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                Drag and drop files or click to browse
                              </p>
                              <Button variant="outline" className="gap-2">
                                <Upload className="w-4 h-4" />
                                Browse Files
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="integrations" className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          {["Slack", "Notion", "Google Drive", "Salesforce", "Zapier", "API"].map((integration) => (
                            <div
                              key={integration}
                              className="p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                  <Link className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{integration}</p>
                                  <p className="text-xs text-muted-foreground">Connect to {integration}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="shrink-0 mt-auto p-6 border-t border-border/50 bg-background/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-sm text-muted-foreground">Ready to deploy</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast.success("Agent saved as draft!", {
                              description: "You can continue editing later.",
                            });
                            setIsCreateDialogOpen(false);
                          }}
                          className="rounded-xl"
                        >
                          Save Draft
                        </Button>
                        <Button
                          onClick={() => {
                            if (knowledgeTab === "website") setKnowledgeTab("files");
                            else if (knowledgeTab === "files") setKnowledgeTab("integrations");
                            else {
                              toast.success("Agent created successfully!", {
                                description: "Your AI assistant is now ready to use.",
                                icon: "🎉",
                              });
                              setIsCreateDialogOpen(false);
                              setCurrentStep("create");
                              setKnowledgeTab("website");
                            }
                          }}
                          className="rounded-xl gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
                        >
                          {knowledgeTab === "integrations" ? "Create Agent" : "Continue"}
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* CHAT DRAWER */}
      <AnimatePresence>
        {activeChatAgent && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-[60] flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{activeChatAgent.name}</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Online</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveChatAgent(null)} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-card border rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                  <p className="text-sm">Hi! I'm the assistant for **{activeChatAgent.name}**. How can I help you today?</p>
                </div>
              </div>
            </div>

            {/* Input with added Chat Input Box */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center gap-2 bg-muted/50 rounded-2xl p-2 border border-border focus-within:border-primary transition-all">
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Message agent..."
                  className="bg-transparent flex-1 text-sm outline-none px-2"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && chatMessage.trim()) {
                      toast.success("Message sent!");
                      setChatMessage("");
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  className="rounded-xl h-10 w-10 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    if (chatMessage.trim()) {
                        toast.success("Message sent!");
                        setChatMessage("");
                    }
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-tighter opacity-50">Powered by Gemini AI 3 Flash</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Superpowers Modal */}
      <Dialog open={isSuperpowersModalOpen} onOpenChange={setIsSuperpowersModalOpen}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col p-0 dark:bg-[#0a0a0a] bg-background border-border/50 rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
            <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                    Agent Superpowers
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                    Enhance your agent with additional capabilities
                </DialogDescription>
            </div>
          </DialogHeader>

          <Tabs value={superpowersTab} onValueChange={(v) => setSuperpowersTab(v as typeof superpowersTab)} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4 border-b border-border/50">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger 
                  value="website" 
                  className="data-[state=active]:bg-background/50 data-[state=active]:text-foreground"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website Knowledge
                </TabsTrigger>
                <TabsTrigger 
                  value="files"
                  className="data-[state=active]:bg-background/50 data-[state=active]:text-foreground"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Knowledge Files
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations"
                  className="data-[state=active]:bg-background/50 data-[state=active]:text-foreground"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Integrations
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Website Knowledge Tab */}
              <TabsContent value="website" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={superpowersWebsiteUrl}
                        onChange={(e) => setSuperpowersWebsiteUrl(e.target.value)}
                        placeholder="Enter website URL (e.g., https://example.com)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background/80 border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      />
                    </div>
                    <Button
                      onClick={handleSuperpowersCrawlWebsite}
                      disabled={!superpowersWebsiteUrl.trim() || isSuperpowersCrawling || !isValidUrl(superpowersWebsiteUrl)}
                      className="px-6"
                    >
                      {isSuperpowersCrawling ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Crawling...
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 mr-2" />
                          Crawl Website
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Website KB – shown after crawl */}
                  {(superpowersCrawledSite || superpowersCrawledUrls.length > 0) && (
                    <div className="rounded-xl border border-border/50 bg-card/50 dark:bg-white/[0.03] overflow-hidden">
                      <div className="px-4 py-3 border-b border-border/50 bg-muted/30 dark:bg-white/[0.04]">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          Website Knowledge Base
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Crawled website – select pages to include in your agent knowledge</p>
                      </div>
                      <div className="p-4 space-y-4">
                        {superpowersCrawledSite && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60 dark:bg-white/[0.04] border border-border/40">
                            {(superpowersCrawledSite.favicon || superpowersCrawledSite.logo) && (
                              <img
                                src={superpowersCrawledSite.logo || superpowersCrawledSite.favicon || ""}
                                alt=""
                                className="w-10 h-10 rounded-lg object-contain bg-muted/50 shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground">{superpowersCrawledSite.title}</p>
                              {superpowersCrawledSite.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{superpowersCrawledSite.description}</p>
                              )}
                              <p className="text-xs text-muted-foreground/80 truncate mt-1">{superpowersCrawledSite.url}</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-foreground">
                              Pages to scrape ({superpowersSelectedUrls.length}/{superpowersCrawledUrls.length})
                            </h4>
                            <span className="text-[10px] text-muted-foreground">Will save on deploy</span>
                          </div>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              value={superpowersUrlSearchQuery}
                              onChange={(e) => setSuperpowersUrlSearchQuery(e.target.value)}
                              placeholder="Search website pages..."
                              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/80 border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm"
                            />
                          </div>
                          <div className="border border-border/50 rounded-lg max-h-[320px] overflow-y-auto bg-background/50">
                            {superpowersFilteredUrls.map((item, index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/30 last:border-b-0 hover:bg-background/80 transition-colors cursor-pointer ${
                                  item.isParent ? "bg-background/40" : ""
                                }`}
                                onClick={() => handleSuperpowersToggleUrl(item.url)}
                              >
                                <input
                                  type="checkbox"
                                  checked={superpowersSelectedUrls.includes(item.url)}
                                  onChange={() => handleSuperpowersToggleUrl(item.url)}
                                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground truncate">{item.title}</div>
                                  <div className="text-xs text-muted-foreground truncate">{item.url}</div>
                                </div>
                                {item.isParent && <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Knowledge Files Tab */}
              <TabsContent value="files" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Upload knowledge files
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOCX, TXT, MD files supported
                      </p>
                      <label className="inline-block">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.docx,.txt,.md"
                          onChange={handleSuperpowersFileUpload}
                          className="hidden"
                        />
                        <Button variant="outline" className="mt-4" asChild>
                          <span className="cursor-pointer">Choose Files</span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  {superpowersUploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        Uploaded Files ({superpowersUploadedFiles.length})
                      </h3>
                      <div className="border border-border/50 rounded-lg divide-y divide-border/50">
                        {superpowersUploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between px-4 py-3 hover:bg-background/80 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {file.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {file.size}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setSuperpowersUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={superpowersIntegrationSearchQuery}
                      onChange={(e) => setSuperpowersIntegrationSearchQuery(e.target.value)}
                      placeholder="Search integrations..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/80 border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Available Integrations
                    </h3>
                    <div className="grid gap-3">
                      {superpowersFilteredIntegrations.map((integration) => {
                        const isSelected = superpowersSelectedIntegrations.includes(integration.id);
                        return (
                          <div
                            key={integration.id}
                            onClick={() => handleSuperpowersToggleIntegration(integration.id)}
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                                : 'border-border/50 hover:border-primary/30 bg-background/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-lg bg-background/80 border border-border/50 flex items-center justify-center text-2xl">
                                  {integration.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-foreground mb-1">
                                    {integration.displayName}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-0.5 rounded bg-background/80 border border-border/50 text-muted-foreground">
                                      {integration.category}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {integration.tools} tools
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className={`relative w-11 h-6 rounded-full transition-colors ${
                                  isSelected ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}>
                                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                    isSelected ? 'translate-x-5' : 'translate-x-0'
                                  }`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {superpowersSelectedIntegrations.length > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground">
                        Select integrations now. They will be connected automatically when you create the agent. ({superpowersSelectedIntegrations.length} selected)
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>

            <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setIsSuperpowersModalOpen(false)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={() => {
                  toast.success("Agent superpowers updated!", {
                    description: "Your agent has been enhanced with the selected capabilities.",
                  });
                  setIsSuperpowersModalOpen(false);
                }}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentStorePage;