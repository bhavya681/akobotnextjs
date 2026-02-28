"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image,
  Video,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  Image as ImageIcon,
  Bot,
  Heart,
  Bookmark,
  Share2,
  Grid3x3,
  List,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import ImageDetailModal from "@/components/feed/ImageDetailModal";
import { FeedItem } from "@/components/feed/FeedCard";
import { galleryAPI, authAPI } from "@/lib/api";
import { galleryItemToFeedItem, galleryItemToAgentItem, type AgentItemFromGallery } from "@/lib/galleryUtils";

const quickActions = [
  {
    icon: MessageSquare,
    label: "Chat Agent",
    path: "/dashboard/tools-old/agent",
    color: "from-blue-600 to-cyan-500",
  },
  {
    icon: Image,
    label: "Generate Image",
    path: "/dashboard/tools-old/image",
    color: "from-purple-600 to-pink-500",
  },
  {
    icon: Bot,
    label: "Create Agent",
    path: "/dashboard/agent-store",
    color: "from-orange-500 to-red-500",
  },
];

interface AgentItem {
  id: number | string;
  name: string;
  description: string;
  avatar: string;
  model: string;
  createdAt: string;
  interactions: number;
  status: "active" | "inactive";
}

const defaultStats = [
  { label: "Generations Today", value: "24", change: "+12%", icon: Sparkles },
  { label: "Credits Used", value: "2,549", change: "51%", icon: Zap },
  { label: "This Week", value: "156", change: "+8%", icon: TrendingUp },
];

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "agents">("images");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<FeedItem[]>([]);
  const [galleryStats, setGalleryStats] = useState<{ totalItems?: number; byContentType?: Record<string, number> } | null>(null);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const [galleryAgents, setGalleryAgents] = useState<AgentItemFromGallery[]>([]);

  const fetchGallery = useCallback(async () => {
    setIsLoadingGallery(true);
    try {
      const isAuth = authAPI.isAuthenticated();
      const [res, statsRes] = await Promise.all([
        isAuth
          ? galleryAPI.getMyGallery({ limit: 50, sortBy: "createdAt", sortOrder: "desc" })
          : galleryAPI.getPublicGallery({ limit: 50, sortBy: "createdAt", sortOrder: "desc" }),
        isAuth ? galleryAPI.getMyStats().catch(() => null) : Promise.resolve(null),
      ]);
      const allItems = res.items || [];
      const feedItems = allItems
        .map(galleryItemToFeedItem)
        .filter((x): x is FeedItem => x !== null);
      const agentItems = allItems
        .map(galleryItemToAgentItem)
        .filter((x): x is AgentItemFromGallery => x !== null);
      setGalleryItems(feedItems);
      setGalleryAgents(agentItems);
      setGalleryStats(statsRes);
    } catch {
      setGalleryItems([]);
      setGalleryAgents([]);
      setGalleryStats(null);
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const galleryImages = galleryItems.filter((i: FeedItem) => i.type === "image");
  const galleryVideos = galleryItems.filter((i: FeedItem) => i.type === "video");
  const displayImages = galleryImages;
  const displayVideos = galleryVideos;
  const displayAgents: AgentItem[] = galleryAgents.map((a) => ({ ...a, id: a.id, interactions: a.interactions }));

  const handleLike = (id: number | string) => {
    toast.success("Liked!");
  };

  const handleSave = (id: number | string) => {
    toast.success("Saved!");
  };

  const handleShare = (id: number | string) => {
    toast.success("Shared!");
  };

  const handleOpenComments = (id: number | string) => {
    toast.info("Comments feature coming soon!");
  };

  const handleOpenDetail = (id: number | string) => {
    const item =
      activeTab === "images"
        ? displayImages.find((i) => i.id === id)
        : displayVideos.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  const getCurrentItems = () => {
    if (activeTab === "images") return displayImages.slice(0, 6);
    if (activeTab === "videos") return displayVideos.slice(0, 6);
    return [];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    // UPDATED: Removed max-w-6xl and mx-auto, changed to w-full and h-full with adjusted padding
    <div className="space-y-8 w-full h-full px-4 md:px-8 py-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back! <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            What would you like to create today?
          </p>
        </div>
        <Link href="/dashboard/tools">
          <Button
            variant="hero"
            size="lg"
            className="gap-2 shadow-md px-6 py-3 text-base font-medium transition-transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            New Creation
          </Button>
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.path} tabIndex={-1}>
              <div
                className="glass-card rounded-2xl py-7 px-6 h-full hover:shadow-lg transition-all border border-transparent hover:border-primary/50 flex flex-col group cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={action.label}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {action.label}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {(galleryStats?.totalItems !== undefined && authAPI.isAuthenticated()
          ? [
              { label: "Total Creations", value: String(galleryStats.totalItems), change: "", icon: Sparkles },
              { label: "Images", value: String((galleryStats.byContentType?.image ?? 0) + (galleryStats.byContentType?.image_to_image ?? 0)), change: "", icon: Image },
              { label: "Videos", value: String(galleryStats.byContentType?.video ?? 0), change: "", icon: Video },
            ]
          : defaultStats
        ).map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-6 flex flex-col h-full shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </span>
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.change && (
                  <span
                    className={`text-base font-medium mb-1 ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : stat.change.startsWith("-")
                        ? "text-red-500"
                        : "text-primary"
                    }`}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Creation History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border/50">
          <button
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "images"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Images ({displayImages.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "videos"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="w-4 h-4" />
            Videos ({displayVideos.length})
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "agents"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="w-4 h-4" />
            Agents ({displayAgents.length})
          </button>
          <div className="ml-auto flex items-center gap-1 p-1 rounded-lg bg-secondary/30">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Display */}
        {activeTab === "agents" ? (
          isLoadingGallery ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">
                {authAPI.isAuthenticated() ? "Loading your agents..." : "Loading agents..."}
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground text-sm">{agent.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          agent.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {agent.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{agent.model}</span>
                      <span>{agent.interactions} interactions</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )
        ) : (
          <div>
            {isLoadingGallery ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground text-sm">
                  {authAPI.isAuthenticated() ? "Loading your creations..." : "Loading gallery..."}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {getCurrentItems().map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-secondary/20 cursor-pointer"
                    onClick={() => handleOpenDetail(item.id)}
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.prompt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <div className="bg-black/50 p-1 rounded-lg backdrop-blur-md">
                          {item.type === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white text-xs line-clamp-2 font-medium drop-shadow-md">{item.prompt}</p>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); handleLike(item.id); }}>
                            <Heart className={`w-3 h-3 ${item.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); handleSave(item.id); }}>
                            <Bookmark className={`w-3 h-3 ${item.isSaved ? 'fill-white' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); handleShare(item.id); }}>
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {getCurrentItems().map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 rounded-xl glass-card hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleOpenDetail(item.id)}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                      {item.type === "video" ? (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.prompt}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                        {item.prompt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span>{item.model}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-foreground">
                          <Heart className="w-3 h-3" />
                          {item.likes}
                        </span>
                        <span className="text-muted-foreground">
                          {item.comments} comments
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View All Link */}
        <div className="flex justify-center pt-4">
          <Link
            href="/dashboard/feed"
            className="text-sm text-primary hover:underline outline-none focus:underline flex items-center gap-2"
          >
            View all creations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Image/Video Detail Modal */}
      <ImageDetailModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onLike={handleLike}
        onSave={handleSave}
        onShare={handleShare}
        onOpenComments={handleOpenComments}
      />
    </div>
  );
};

export default DashboardHome;