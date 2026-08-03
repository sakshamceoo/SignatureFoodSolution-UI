import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE,
  SITE_URL,
  absoluteUrl,
  fullTitle,
  jsonLdForPath,
  pageMetaForPath,
} from "./site";

const META_ATTR = "data-sfs-seo";
const LINK_ATTR = "data-sfs-seo-link";
const JSON_LD_ID = "sfs-jsonld";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"][${META_ATTR}]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(META_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href, extra = {}) {
  let el = document.head.querySelector(`link[rel="${rel}"][${LINK_ATTR}]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(LINK_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
}

function setJsonLd(graphs) {
  let el = document.getElementById(JSON_LD_ID);
  if (!el) {
    el = document.createElement("script");
    el.id = JSON_LD_ID;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graphs.map((graph) => {
      const clone = { ...graph };
      delete clone["@context"];
      return clone;
    }),
  });
}

/**
 * Route-aware SEO + structured data for search engines and LLM crawlers.
 */
export default function Seo() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const page = pageMetaForPath(pathname);
    const url = absoluteUrl(page.path);
    const title = fullTitle(page.title);
    const description = page.description;
    const image = absoluteUrl("/favicon.png");

    document.title = title;

    // Core
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", page.keywords);
    upsertMeta("name", "author", SITE.name);
    upsertMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    upsertMeta("name", "googlebot", "index, follow");
    upsertMeta("name", "bingbot", "index, follow");
    upsertMeta("name", "theme-color", "#f5f1e8");
    upsertMeta("name", "application-name", SITE.name);
    upsertMeta("name", "apple-mobile-web-app-title", SITE.name);
    upsertMeta("name", "format-detection", "telephone=yes");
    upsertMeta("name", "geo.region", "IN-DL");
    upsertMeta("name", "geo.placename", "Delhi");
    upsertMeta("name", "language", SITE.language);

    // Open Graph
    upsertMeta("property", "og:type", page.type);
    upsertMeta("property", "og:site_name", SITE.name);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:locale", SITE.locale);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", `${SITE.name} logo`);

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    // LLM / AI crawler hints
    upsertMeta("name", "ai-content-declaration", "human-created");
    upsertMeta(
      "name",
      "summary",
      `${SITE.name}: ${SITE.tagline} Fresh chicken, mutton, seafood, and ready-to-eat supply across Delhi NCR.`,
    );

    upsertLink("canonical", url);
    upsertLink("alternate", absoluteUrl("/llms.txt"), { type: "text/plain", title: "LLM index" });

    setJsonLd(jsonLdForPath(pathname));

    // Prefer English document language
    document.documentElement.lang = SITE.language;
  }, [pathname, search]);

  return null;
}

export { SITE_URL, SITE };
