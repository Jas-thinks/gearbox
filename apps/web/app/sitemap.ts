import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getEquipmentSlugs } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticPages = [
    "",
    "/browse",
    "/owners",
    "/waitlist",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const equipmentPages = getEquipmentSlugs().map((slug) => ({
    url: `${baseUrl}/equipment/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...equipmentPages];
}
