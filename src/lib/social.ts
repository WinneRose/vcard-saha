import type { SocialPlatform } from "@/types/profile";

export type PlatformMeta = {
  label: string;
  gradientFrom: string;
  gradientTo: string;
};

export const PLATFORM_META: Record<SocialPlatform, PlatformMeta> = {
  linkedin: { label: "LinkedIn", gradientFrom: "from-[#0a66c2]", gradientTo: "to-[#1e3a8a]" },
  github: { label: "GitHub", gradientFrom: "from-[#1f2937]", gradientTo: "to-[#0b0f17]" },
  twitter: { label: "Twitter", gradientFrom: "from-[#0f172a]", gradientTo: "to-[#1e293b]" },
  website: { label: "Web", gradientFrom: "from-fuchsia-500", gradientTo: "to-indigo-600" },
};

export function extractHandle(platform: SocialPlatform, url: string): string {
  if (!url) return "";
  let parsed: URL;
  try {
    parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    return url;
  }
  const path = parsed.pathname.replace(/^\/+|\/+$/g, "");
  switch (platform) {
    case "linkedin": {
      const m = path.match(/^(?:in|company|pub)\/([^/]+)/);
      return m ? `@${m[1]}` : parsed.hostname.replace(/^www\./, "");
    }
    case "github":
    case "twitter": {
      const seg = path.split("/").filter(Boolean)[0];
      return seg ? `@${seg}` : parsed.hostname.replace(/^www\./, "");
    }
    case "website":
      return parsed.hostname.replace(/^www\./, "");
  }
}

export function favicon(url: string): string | null {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}
