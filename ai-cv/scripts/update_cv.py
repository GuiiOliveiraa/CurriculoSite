from __future__ import annotations

import json
import re
import unicodedata
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Iterable


TRACKED_SECTIONS = [
    "skills",
    "technologies",
    "tools",
    "projects",
    "experiences",
    "highlights",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def load_json(path: Path, default_factory: Callable[[], dict[str, Any]]) -> dict[str, Any]:
    if not path.exists():
        return default_factory()

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = path.with_suffix(f"{path.suffix}.tmp")
    with temp_path.open("w", encoding="utf-8", newline="\n") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
        file.write("\n")
    temp_path.replace(path)


def default_cv() -> dict[str, Any]:
    return {
        "version": 1,
        "updated_at": now_iso(),
        "profile": {},
        "skills": [],
        "technologies": [],
        "tools": [],
        "projects": [],
        "experiences": [],
        "highlights": [],
        "knowledge_history": [],
    }


def default_processed_files() -> dict[str, Any]:
    return {"version": 1, "last_run": None, "files": {}}


def ensure_cv_shape(cv: dict[str, Any]) -> dict[str, Any]:
    cv.setdefault("version", 1)
    cv.setdefault("updated_at", now_iso())
    cv.setdefault("profile", {})
    cv.setdefault("knowledge_history", [])
    for section in TRACKED_SECTIONS:
        cv.setdefault(section, [])
        if not isinstance(cv[section], list):
            cv[section] = []
    return cv


def merge_analysis(
    cv: dict[str, Any],
    analysis: dict[str, Any],
    *,
    source_path: str,
    content_hash: str,
) -> dict[str, Any]:
    cv = ensure_cv_shape(cv)
    timestamp = now_iso()
    source = source_path.replace("\\", "/")

    for section in TRACKED_SECTIONS:
        for raw_item in analysis.get(section, []):
            item = coerce_item(raw_item, section)
            if item:
                merge_item(cv[section], item, source=source, timestamp=timestamp)

    cv["updated_at"] = timestamp
    cv["knowledge_history"].append(
        {
            "source": source,
            "hash": content_hash,
            "processed_at": timestamp,
            "summary": clean_string(analysis.get("summary", "")),
            "analysis": compact_analysis(analysis),
        }
    )
    return cv


def coerce_item(raw_item: Any, section: str) -> dict[str, Any] | None:
    if isinstance(raw_item, str):
        raw_item = {"name": raw_item}
    if not isinstance(raw_item, dict):
        return None

    item = deepcopy(raw_item)
    name = clean_string(item.get("name") or item.get("title") or item.get("label"))
    if not name:
        return None

    cleaned: dict[str, Any] = {
        "name": name,
        "category": clean_string(item.get("category")) or default_category(section),
        "description": clean_string(item.get("description") or item.get("summary")),
    }

    icon = clean_string(item.get("icon"))
    if icon:
        cleaned["icon"] = icon

    evidence = clean_string(item.get("evidence"))
    if evidence:
        cleaned["evidence"] = [evidence]

    technologies = merge_string_lists(item.get("technologies"), item.get("stack"))
    if technologies:
        cleaned["technologies"] = technologies

    links = normalize_links(item.get("links"))
    if links:
        cleaned["links"] = links

    return cleaned


def merge_item(
    target_items: list[dict[str, Any]],
    incoming: dict[str, Any],
    *,
    source: str,
    timestamp: str,
) -> None:
    key = normalize_key(incoming["name"])
    existing = next(
        (
            item
            for item in target_items
            if normalize_key(str(item.get("name") or item.get("title") or "")) == key
        ),
        None,
    )

    if existing is None:
        entry = deepcopy(incoming)
        entry["sources"] = [source]
        entry["first_seen"] = timestamp
        entry["last_seen"] = timestamp
        target_items.append(entry)
        return

    existing["last_seen"] = timestamp
    existing["sources"] = merge_string_lists(existing.get("sources"), [source])

    for field in ("category", "icon"):
        if incoming.get(field) and not existing.get(field):
            existing[field] = incoming[field]

    incoming_description = clean_string(incoming.get("description"))
    existing_description = clean_string(existing.get("description"))
    if incoming_description and (
        not existing_description or len(incoming_description) >= len(existing_description)
    ):
        existing["description"] = incoming_description

    for field in ("technologies", "evidence"):
        merged = merge_string_lists(existing.get(field), incoming.get(field))
        if merged:
            existing[field] = merged

    merged_links = merge_links(existing.get("links"), incoming.get("links"))
    if merged_links:
        existing["links"] = merged_links

    existing.setdefault("first_seen", timestamp)


def compact_analysis(analysis: dict[str, Any]) -> dict[str, Any]:
    compacted: dict[str, Any] = {}
    for section in TRACKED_SECTIONS:
        compacted[section] = [
            coerce_item(item, section)
            for item in analysis.get(section, [])
            if coerce_item(item, section)
        ]
    return compacted


def normalize_key(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return value.strip()


def clean_string(value: Any) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def merge_string_lists(*values: Any) -> list[str]:
    merged: list[str] = []
    seen: set[str] = set()
    for value in values:
        if value is None:
            continue
        items = value if isinstance(value, list) else [value]
        for item in items:
            text = clean_string(item)
            if not text:
                continue
            key = normalize_key(text)
            if key not in seen:
                seen.add(key)
                merged.append(text)
    return merged


def normalize_links(raw_links: Any) -> list[dict[str, str]]:
    if not isinstance(raw_links, list):
        return []

    links: list[dict[str, str]] = []
    for link in raw_links:
        if isinstance(link, str):
            url = clean_string(link)
            label = "Link"
        elif isinstance(link, dict):
            url = clean_string(link.get("url") or link.get("href"))
            label = clean_string(link.get("label") or link.get("name")) or "Link"
        else:
            continue

        if url.startswith(("http://", "https://", "mailto:")):
            links.append({"label": label, "url": url})

    return links


def merge_links(*values: Any) -> list[dict[str, str]]:
    merged: list[dict[str, str]] = []
    seen: set[str] = set()
    for value in values:
        for link in normalize_links(value):
            key = link["url"].lower()
            if key not in seen:
                seen.add(key)
                merged.append(link)
    return merged


def default_category(section: str) -> str:
    defaults = {
        "skills": "Ferramentas",
        "technologies": "Ferramentas",
        "tools": "Ferramentas",
        "projects": "Projetos",
        "experiences": "Experiências",
        "highlights": "Destaques",
    }
    return defaults.get(section, "Ferramentas")


def remove_deleted_processed_entries(
    processed_files: dict[str, Any],
    current_paths: Iterable[str],
) -> dict[str, Any]:
    current = set(current_paths)
    files = processed_files.setdefault("files", {})
    processed_files["files"] = {
        path: metadata
        for path, metadata in files.items()
        if not path.startswith("knowledge/") or path in current
    }
    return processed_files
