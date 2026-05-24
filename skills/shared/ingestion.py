"""
News ingestion layer.

Strategy (in priority order):
  1. Perplexity Sonar API  — live web search (best, requires PERPLEXITY_API_KEY)
  2. RSS feeds             — always available, no key required
  3. HN/Reddit scrape      — fallback via requests
"""

import datetime
import json
import logging
import os
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from typing import Optional

import requests

from .config import PERPLEXITY_API_KEY, TRACKED_SOURCES

log = logging.getLogger(__name__)

TODAY = datetime.date.today().isoformat()


@dataclass
class NewsItem:
    title: str
    summary: str
    source: str
    url: str
    relevance_tags: list[str] = field(default_factory=list)


# ── RSS feeds that reliably cover AI creative tools ───────────────────────────
RSS_FEEDS = [
    ("The Decoder",        "https://the-decoder.com/feed/"),
    ("Import AI",          "https://jack-clark.net/feed/"),
    ("Hugging Face Blog",  "https://huggingface.co/blog/feed.xml"),
    ("VentureBeat AI",     "https://venturebeat.com/category/ai/feed/"),
    ("Runway Blog",        "https://runwayml.com/blog/feed.xml"),
]

PERPLEXITY_ENDPOINT = "https://api.perplexity.ai/chat/completions"


def fetch_via_perplexity(query: str, n: int = 3) -> list[NewsItem]:
    """Use Perplexity Sonar to get live search-grounded news items."""
    if not PERPLEXITY_API_KEY:
        return []

    payload = {
        "model": "sonar-pro",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a research assistant. Return ONLY valid JSON — "
                    "a list of news items. No prose, no markdown fences."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Find the top {n} most important news stories published today ({TODAY}) "
                    f"about AI video generation, AI cinematography tools, or updates from: "
                    f"{', '.join(TRACKED_SOURCES)}. "
                    f"Return JSON array with keys: title, summary (2 sentences), source, url, relevance_tags."
                ),
            },
        ],
        "temperature": 0.1,
        "search_recency_filter": "day",
    }

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(PERPLEXITY_ENDPOINT, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        raw = resp.json()["choices"][0]["message"]["content"]
        items = json.loads(raw)
        return [NewsItem(**i) for i in items[:n]]
    except Exception as exc:
        log.warning("Perplexity fetch failed: %s", exc)
        return []


def fetch_via_rss(n: int = 3) -> list[NewsItem]:
    """Parse RSS feeds and return the n most relevant recent items."""
    keywords = {s.lower() for s in TRACKED_SOURCES} | {
        "ai video", "ai film", "generative video", "text-to-video",
        "diffusion", "cinematic", "runway", "midjourney", "elevenlabs",
    }

    candidates: list[NewsItem] = []

    for feed_name, url in RSS_FEEDS:
        try:
            resp = requests.get(url, timeout=10, headers={"User-Agent": "DubaiAI-Pro/1.0"})
            resp.raise_for_status()
            root = ET.fromstring(resp.content)
            channel = root.find("channel") or root

            for item in channel.findall("item")[:10]:
                title   = (item.findtext("title") or "").strip()
                summary = (item.findtext("description") or "").strip()[:300]
                link    = (item.findtext("link") or "").strip()

                combined = (title + " " + summary).lower()
                tags = [kw for kw in keywords if kw in combined]

                if tags:
                    candidates.append(
                        NewsItem(
                            title=title,
                            summary=summary,
                            source=feed_name,
                            url=link,
                            relevance_tags=tags,
                        )
                    )
        except Exception as exc:
            log.warning("RSS feed %s failed: %s", feed_name, exc)

    # Sort by number of matching tags (proxy for relevance)
    candidates.sort(key=lambda x: len(x.relevance_tags), reverse=True)
    return candidates[:n]


def get_top_news(n: int = 3) -> list[NewsItem]:
    """
    Return the top n news items using the best available source.
    Falls back gracefully through the ingestion chain.
    """
    items = fetch_via_perplexity(
        query=f"AI video generation cinematography tools news {TODAY}", n=n
    )

    if len(items) < n:
        log.info("Perplexity returned %d items, supplementing with RSS.", len(items))
        rss_items = fetch_via_rss(n=n - len(items))
        items.extend(rss_items)

    if not items:
        log.warning("All ingestion sources failed — returning placeholder items.")
        items = [
            NewsItem(
                title=f"[Ingestion failed — check API keys and network] Item {i+1}",
                summary="No live data available. Run with PERPLEXITY_API_KEY set for live news.",
                source="fallback",
                url="",
                relevance_tags=[],
            )
            for i in range(n)
        ]

    return items[:n]
