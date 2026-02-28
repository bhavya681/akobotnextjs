import type { GalleryItem, GalleryContentType } from "@/lib/api";
import type { FeedItem } from "@/components/feed/FeedCard";

export interface AgentItemFromGallery {
  id: string;
  name: string;
  description: string;
  avatar: string;
  model: string;
  createdAt: string;
  interactions: number;
  status: "active" | "inactive";
}

/**
 * Map API GalleryItem (contentType llm) to AgentItem for dashboard
 */
export function galleryItemToAgentItem(g: GalleryItem): AgentItemFromGallery | null {
  if (g.contentType !== "llm") return null;
  return {
    id: g._id,
    name: (g.prompt || g.metadata?.title as string)?.slice(0, 50) || "AI Agent",
    description: (g.prompt || "Chat/LLM creation")?.slice(0, 120) || "",
    avatar: g.userAvatar || "",
    model: g.modelName || g.modelId || "AI",
    createdAt: g.createdAt,
    interactions: 0,
    status: "active",
  };
}

/**
 * Map API GalleryItem to FeedItem for display in feed/masonry
 */
export function galleryItemToFeedItem(g: GalleryItem): FeedItem | null {
  const isVideo = g.contentType === "video";
  const isImage = g.contentType === "image" || g.contentType === "image_to_image";
  if (!isVideo && !isImage) return null; // Skip llm content type for visual feed

  const mediaUrl = g.outputUrl || g.thumbnailUrl || "";
  if (!mediaUrl) return null;

  return {
    id: g._id,
    type: isVideo ? "video" : "image",
    mediaUrl,
    thumbnailUrl: g.thumbnailUrl || (isVideo ? mediaUrl : undefined),
    prompt: g.prompt || "AI generated",
    author: {
      username: g.username || "anonymous",
      avatar: g.userAvatar || "",
      verified: false,
    },
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    model: g.modelName || g.modelId || "AI",
    createdAt: g.createdAt,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
  };
}

/**
 * Map contentType filter to API value
 */
export function feedFilterToContentType(
  filter: string
): GalleryContentType | undefined {
  if (filter === "images") return "image";
  if (filter === "videos") return "video";
  return undefined;
}
