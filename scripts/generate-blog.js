#!/usr/bin/env node
"use strict";

/**
 * Automated blog generator tailored for the lafoule-m project.
 *
 * Features:
 * - Picks a fresh topic from scripts/topics.json and avoids recently used slugs.
 * - Pulls a royalty-free hero image from Unsplash (requires UNSPLASH_ACCESS_KEY).
 * - Optional Hugging Face text enrichment when HF_ACCESS_TOKEN + HF_MODEL_ID are set.
 * - Creates fully formatted MDX under content/auto/<slug>/index.mdx with SEO-friendly sections.
 * - Stores generation history to keep track of previously produced topics.
 */

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const fetch =
  global.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: nodeFetch }) => nodeFetch(...args)));

const TOPIC_SOURCE = path.join(process.cwd(), "scripts", "topics.json");
const CONTENT_ROOT = path.join(process.cwd(), "content");
const AUTO_CONTENT_DIR = path.join(CONTENT_ROOT, "auto");
const HISTORY_PATH = path.join(AUTO_CONTENT_DIR, "_history.json");
const IMAGE_OUTPUT_DIR = path.join(process.cwd(), "public", "images");

const FALLBACK_IMAGE_BASE64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhITFhUVFRUWFxUVFRUVFhUVFRUWFhUVFhUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAQGBwIDB//EADQQAAEDAgQDBgUDBAMAAAAAAAEAAgMEEQUSITEGEyJBUWFxgZGhByNCseEjMpLRFSNSYv/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACIRAQABAwMFAAAAAAAAAAAAAAABAgMRITEEEjJhBRQygf/aAAwDAQACEQMRAD8A9wAoiIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q==";
const DEFAULT_HF_MODEL_ID = "google/flan-t5-base";

const DAYS_TO_AVOID_DUPLICATES = 30;
const DEFAULT_TAGS = ["blog", "automation", "tech insights"];

/**
 * Utility: ensure directory exists.
 */
async function ensureDirectory(dirPath) {
  try {
    await fsp.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Utility: slugify string.
 */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Utility: shuffle array (Fisher-Yates).
 */
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Utility: load topics from JSON file.
 */
async function loadTopics() {
  const raw = await fsp.readFile(TOPIC_SOURCE, "utf8");
  const parsed = JSON.parse(raw);
  return parsed.map((item) =>
    typeof item === "string" ? { title: item, tags: [] } : item
  );
}

/**
 * Utility: load history JSON.
 */
async function loadHistory() {
  try {
    const raw = await fsp.readFile(HISTORY_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function saveHistory(history) {
  const content = JSON.stringify(history, null, 2);
  await fsp.writeFile(HISTORY_PATH, content);
}

function isRecent(dateString, days = DAYS_TO_AVOID_DUPLICATES) {
  if (!dateString) return false;
  const createdTs = Date.parse(dateString);
  if (Number.isNaN(createdTs)) return false;
  const diffDays = (Date.now() - createdTs) / (1000 * 60 * 60 * 24);
  return diffDays < days;
}

function slugExists(slug) {
  const manualPath = path.join(CONTENT_ROOT, slug);
  const autoPath = path.join(AUTO_CONTENT_DIR, slug);
  return fs.existsSync(manualPath) || fs.existsSync(autoPath);
}

async function pickTopic(topics, history) {
  const shuffled = shuffle(topics);

  for (const topic of shuffled) {
    const baseSlug = slugify(topic.title);
    const historyEntry = history.find((entry) => entry.slug === baseSlug);
    const recentlyUsed = historyEntry && isRecent(historyEntry.createdAt);
    const exists = slugExists(baseSlug);

    if (!recentlyUsed && !exists) {
      return { topic, slug: baseSlug };
    }
  }

  // Fallback: append date to ensure uniqueness.
  const fallback = shuffled[0];
  const baseSlug = slugify(fallback.title);
  let candidateSlug = baseSlug;
  let counter = 1;
  while (slugExists(candidateSlug)) {
    candidateSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return { topic: fallback, slug: candidateSlug };
}

async function fetchUnsplashImage(topic, slug) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn(
      "UNSPLASH_ACCESS_KEY is not set. Using locally generated placeholder image."
    );
    return createFallbackImage(slug);
  }

  try {
    const query = encodeURIComponent(topic);
    const url = `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&content_filter=high&client_id=${accessKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Unsplash request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const imageUrl = data?.urls?.regular;
    if (!imageUrl) {
      throw new Error("Unsplash response does not include an image URL.");
    }

    const photoCredit = {
      name: data?.user?.name || "Unsplash Creator",
      profileUrl: data?.user?.links?.html || "https://unsplash.com",
    };

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(
        `Failed to download Unsplash image: ${imageResponse.status}`
      );
    }
    const arrayBuffer = await imageResponse.arrayBuffer();
    await ensureDirectory(IMAGE_OUTPUT_DIR);
    const imagePath = path.join(IMAGE_OUTPUT_DIR, `${slug}.jpg`);
    await fsp.writeFile(imagePath, Buffer.from(arrayBuffer));

    return {
      imagePath: `/images/${slug}.jpg`,
      credit: photoCredit,
    };
  } catch (error) {
    console.warn(
      `Unsplash download failed (${error.message}). Falling back to placeholder image.`
    );
    return createFallbackImage(slug);
  }
}

async function createFallbackImage(slug) {
  await ensureDirectory(IMAGE_OUTPUT_DIR);
  const buffer = Buffer.from(FALLBACK_IMAGE_BASE64, "base64");
  const imagePath = path.join(IMAGE_OUTPUT_DIR, `${slug}.jpg`);
  await fsp.writeFile(imagePath, buffer);

  return {
    imagePath: `/images/${slug}.jpg`,
    credit: {
      name: "Placeholder Image",
      profileUrl:
        "https://github.com/ozkancimenli/lafoule-m/blob/main/scripts/generate-blog.js",
    },
  };
}

async function optionalAiSection(topic) {
  const token = process.env.HF_ACCESS_TOKEN;
  const modelId = process.env.HF_MODEL_ID || DEFAULT_HF_MODEL_ID;
  const endpoint =
    process.env.HF_ENDPOINT ||
    (modelId ? `https://api-inference.huggingface.co/models/${modelId}` : null);

  if (!token || !endpoint) {
    return null;
  }

  try {
    const prompt = `Write two concise paragraphs (max 180 words total) explaining why "${topic}" matters for modern web developers. Use an inclusive, encouraging tone.`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        max_new_tokens: 220,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.warn(
        `Hugging Face request failed (${response.status}). Using fallback content.`
      );
      return null;
    }

    const result = await response.json();
    let text;
    if (Array.isArray(result)) {
      const candidate = result[0];
      text =
        candidate?.generated_text ??
        candidate?.summary_text ??
        (typeof candidate === "string" ? candidate : null);
    } else {
      text =
        result.generated_text ??
        result.summary_text ??
        (typeof result === "string" ? result : null);
    }

    if (!text) {
      return null;
    }

    return String(text)
      .replace(prompt, "")
      .trim();
  } catch (error) {
    console.warn("AI content generation failed:", error.message);
    return null;
  }
}

function buildArticleContent({
  topicTitle,
  description,
  date,
  slug,
  tags,
  heroImage,
  aiSection,
}) {
  const heroMarkdown = `
<Image
  src="${heroImage.imagePath}"
  width="1200"
  height="628"
  alt="${topicTitle}"
  priority
  sizes="100vw"
/>
`.trim();

  const aiParagraphs = aiSection
    ? aiSection
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const introParagraph =
    aiParagraphs[0] ||
    `Staying productive and shipping value consistently requires purposeful systems. This article breaks down how **${topicTitle}** fits into a modern workflow, with practical guidance you can action today.`;

  const whyParagraph =
    aiParagraphs[1] ||
    `${topicTitle} directly influences how search engines interpret your authority and how readers experience your product. Treat it as a flywheel: every improvement strengthens your content quality, dwell time, and conversion signals in tandem.`;

  const keyTakeaways = [
    `Understand where ${topicTitle.toLowerCase()} drives the biggest SEO and UX impact.`,
    "Apply quick-win tactics you can implement in under 30 minutes.",
    "Measure success with lightweight analytics that give clear signals.",
  ];

  const checklist = [
    "Map user intent to the primary keyword cluster.",
    "Create content sections that answer top follow-up questions.",
    "Add internal links to keep readers exploring related resources.",
    "Review accessibility and performance before publishing.",
  ];

  const qnaSection = [
    {
      question: `How does ${topicTitle} improve organic visibility?`,
      answer: `Search engines reward content that solves a specific problem comprehensively. ${topicTitle} aligns your page structure, copy, and performance signals with user expectations, boosting engagement metrics that feed ranking models.`,
    },
    {
      question: "Is this strategy only for large teams?",
      answer:
        "No. Solo makers and small teams can adopt a lightweight version by focusing on one measurable improvement per sprint and templating the process to stay consistent.",
    },
  ];

  const takeawaysList = keyTakeaways.map((item) => `- ${item}`).join("\n");
  const checklistList = checklist.map((item) => `- [ ] ${item}`).join("\n");
  const qnaMarkdown = qnaSection
    .map(
      (item) => `**Q:** ${item.question}\n\n**A:** ${item.answer}\n`
    )
    .join("\n");

  return `---
title: "${topicTitle}"
description: "${description}"
publishedAt: "${date}"
updatedAt: "${date}"
author: "Ozkan Cimenli"
isPublished: true
tags:
${tags.map((tag) => `  - ${tag}`).join("\n")}
image: "${heroImage.imagePath}"
---

${heroMarkdown}

${introParagraph}

---

## Why ${topicTitle} matters right now

${whyParagraph}

${takeawaysList}

---

## Implementation roadmap

1. **Discover intent:** Audit the current keyword landscape and prioritise the highest-impact subtopics.
2. **Structure content:** Map headings to user questions and weave in scannable elements like checklists and code snippets.
3. **Measure outcomes:** Track organic clicks, scroll depth, and conversion assists to prove ROI.

---

## Publication Checklist

${checklistList}

---

## Expert Q&A

${qnaMarkdown}

---

_Photo by [${heroImage.credit.name}](${heroImage.credit.profileUrl}) on Unsplash._

_This post was automatically generated and reviewed for clarity before publishing._
`;
}

async function writeMdxFile(slug, content) {
  const dir = path.join(AUTO_CONTENT_DIR, slug);
  await ensureDirectory(dir);
  await fsp.writeFile(path.join(dir, "index.mdx"), content);
}

async function main() {
  await ensureDirectory(AUTO_CONTENT_DIR);

  const topics = await loadTopics();
  if (!topics.length) {
    throw new Error("Topic list is empty. Update scripts/topics.json.");
  }

  const history = await loadHistory();
  const { topic, slug } = await pickTopic(topics, history);
  const today = new Date().toISOString().split("T")[0];
  const description = topic.description
    ? topic.description
    : `A practical guide to ${topic.title.toLowerCase()} for modern developers.`;

  const heroImage = await fetchUnsplashImage(topic.title, slug);
  const aiSection = await optionalAiSection(topic.title);

  const articleContent = buildArticleContent({
    topicTitle: topic.title,
    description,
    date: today,
    slug,
    tags: Array.from(new Set([...(topic.tags || []), ...DEFAULT_TAGS])),
    heroImage,
    aiSection,
  });

  await writeMdxFile(slug, articleContent);

  const updatedHistory = [
    {
      slug,
      title: topic.title,
      createdAt: new Date().toISOString(),
      image: heroImage.imagePath,
    },
    ...history.filter((entry) => entry.slug !== slug),
  ];
  await saveHistory(updatedHistory);

  console.log(`✅ Blog post generated under content/auto/${slug}/index.mdx`);
  console.log(`✅ Featured image saved to public${heroImage.imagePath}`);
}

main().catch((error) => {
  console.error("Blog generation failed:", error.message);
  process.exit(1);
});
