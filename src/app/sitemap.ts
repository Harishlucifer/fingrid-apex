import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes";

const BASE = "https://fingrid.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE}${route === "/" ? "" : route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : route.split("/").length > 2 ? 0.5 : 0.8,
  }));
}
