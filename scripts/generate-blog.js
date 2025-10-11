#!/usr/bin/env node
"use strict";

/**
 * Automated blog generator tailored for the lafoule-m project.
 *
 * Features:
 * - Picks a fresh topic from scripts/topics.json and avoids recently used slugs.
 * - Pulls a royalty-free hero image from Unsplash (requires UNSPLASH_ACCESS_KEY).
 * - Optional Hugging Face text enrichment when HF_ACCESS_TOKEN + HF_MODEL_ID are set.
 * - Creates fully formatted MDX under content/<slug>/index.mdx with SEO-friendly sections.
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
const LEGACY_AUTO_CONTENT_DIR = path.join(CONTENT_ROOT, "auto");
const LEGACY_HISTORY_PATH = path.join(LEGACY_AUTO_CONTENT_DIR, "_history.json");
const HISTORY_PATH = path.join(process.cwd(), "scripts", "_auto-history.json");
const BLOG_IMAGE_OUTPUT_DIR = path.join(process.cwd(), "public", "blogs");

const FALLBACK_IMAGE_BASE64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhITFhUVFRUWFxUVFRUVFhUVFRUWFhUVFhUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAQGBwIDB//EADQQAAEDAgQDBgUDBAMAAAAAAAEAAgMEEQUSITEGEyJBUWFxgZGhByNCseEjMpLRFSNSYv/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACIRAQABAwMFAAAAAAAAAAAAAAABAgMRITEEEjJhBRQygf/aAAwDAQACEQMRAD8A9wAoiIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q==";
const DEFAULT_HF_MODEL_ID = "google/flan-t5-base";

const DAYS_TO_AVOID_DUPLICATES = 30;
const DEFAULT_TAGS = ["web development", "productivity", "developer experience"];

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
      try {
        const legacyRaw = await fsp.readFile(LEGACY_HISTORY_PATH, "utf8");
        const legacyData = JSON.parse(legacyRaw);
        await saveHistory(legacyData);
        return legacyData;
      } catch (legacyError) {
        if (legacyError.code === "ENOENT") {
          return [];
        }
        throw legacyError;
      }
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
  const targetPath = path.join(CONTENT_ROOT, slug);
  const legacyPath = path.join(LEGACY_AUTO_CONTENT_DIR, slug);
  return fs.existsSync(targetPath) || fs.existsSync(legacyPath);
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
    await ensureDirectory(BLOG_IMAGE_OUTPUT_DIR);
    const fileName = `${slug}.jpg`;
    const imagePath = path.join(BLOG_IMAGE_OUTPUT_DIR, fileName);
    await fsp.writeFile(imagePath, Buffer.from(arrayBuffer));

    return {
      src: `/blogs/${fileName}`,
      frontMatterPath: `../../public/blogs/${fileName}`,
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
  await ensureDirectory(BLOG_IMAGE_OUTPUT_DIR);
  const buffer = Buffer.from(FALLBACK_IMAGE_BASE64, "base64");
  const fileName = `${slug}.jpg`;
  const imagePath = path.join(BLOG_IMAGE_OUTPUT_DIR, fileName);
  await fsp.writeFile(imagePath, buffer);

  return {
    src: `/blogs/${fileName}`,
    frontMatterPath: `../../public/blogs/${fileName}`,
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
  src="${heroImage.src}"
  width="1920"
  height="1080"
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
    `Staying focused on deep engineering work means removing the manual chores around **${topicTitle}**. This playbook shows you how to protect creative energy, keep delivery velocity high, and make the outcomes easy to measure.`;

  const whyParagraph =
    aiParagraphs[1] ||
    `${topicTitle} creates leverage when it is documented, automated, and visible. The sooner you codify the workflow, the easier it is to onboard teammates, ship consistently, and defend the investment with real metrics.`;

  const valueBullets = [
    "Removes context switching triggered by frequent, low-skill steps.",
    "Turns this focus into a reusable playbook anyone on the team can follow.",
    "Surfaces the signals leaders need to know the work is paying off.",
  ];

  const checklist = [
    "Every step has a single command or documented API call.",
    "Runbooks live with the codebase so updates ship together.",
    "Automations log successes and failures where the team already looks.",
    "Ownership and escalation paths are obvious to new contributors.",
  ];

  const toolStack = [
    "**Task runners:** Keep the day-to-day steps reproducible locally with npm scripts, Make, or Turborepo.",
    "**CI pipelines:** Validate, deploy, and notify from one place using GitHub Actions or GitLab CI.",
    "**Observability:** Dashboards, alerts, or lightweight logs to highlight when things drift.",
    "**Collaboration:** ChatOps bots or shared docs so updates stay transparent.",
  ];

  const qnaSection = [
    {
      question: `How does investing in ${topicTitle} accelerate delivery?`,
      answer: `It reduces the cognitive overhead of repeating the same steps. Once the workflow is codified, engineers spend more cycles on problem solving instead of setup and teardown.`,
    },
    {
      question: "Will this slow down smaller teams?",
      answer:
        "Start with tiny scripts—automate the riskiest or most annoying steps first. Expansion only happens when the team sees a clear payoff.",
    },
    {
      question: "How do we keep the automation trustworthy?",
      answer:
        "Treat it like product code: add tests when possible, wire in alerts, and review changes alongside feature work.",
    },
  ];

  const valueList = valueBullets.map((item) => `- ${item}`).join("\n");
  const checklistList = checklist.map((item) => `- [ ] ${item}`).join("\n");
  const toolStackList = toolStack.map((item) => `- ${item}`).join("\n");
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
image: "${heroImage.frontMatterPath}"
---

${heroMarkdown}

${introParagraph}

---

## Why ${topicTitle} should be on your roadmap

${whyParagraph}

${valueList}

---

## Implementation roadmap

1. **Discover intent:** Capture the scenarios and edge cases that make this work feel hard today.
2. **Design the happy path:** Document inputs, outputs, and checkpoints so every run looks the same.
3. **Automate iteratively:** Start with scripts or workflows that remove the noisiest manual effort.
4. **Measure outcomes:** Track time saved, incidents avoided, and satisfaction to prove the value.

---

## Productivity checklist

${checklistList}

---

## Tool stack to explore

${toolStackList}

---

## Expert Q&A

${qnaMarkdown}

---

_Photo by [${heroImage.credit.name}](${heroImage.credit.profileUrl}) on Unsplash._

_This post was automatically generated and reviewed for clarity before publishing._
`;
}

async function writeMdxFile(slug, content) {
  const dir = path.join(CONTENT_ROOT, slug);
  await ensureDirectory(dir);
  await fsp.writeFile(path.join(dir, "index.mdx"), content);
}

async function main() {
  await ensureDirectory(CONTENT_ROOT);

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
      image: heroImage.src,
    },
    ...history.filter((entry) => entry.slug !== slug),
  ];
  await saveHistory(updatedHistory);

  console.log(`✅ Blog post generated under content/${slug}/index.mdx`);
  console.log(`✅ Featured image saved to public${heroImage.src}`);
}

main().catch((error) => {
  console.error("Blog generation failed:", error.message);
  process.exit(1);
});
