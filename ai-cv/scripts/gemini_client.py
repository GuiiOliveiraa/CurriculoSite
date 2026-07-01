from __future__ import annotations

import json
import logging
import os
import re
from pathlib import Path
from typing import Any, Mapping

from ai_provider import AIProvider


logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).resolve().parents[1]
PROMPT_TEMPLATE_PATH = ROOT_DIR / "templates" / "gemini_analysis_prompt.md"
DEFAULT_MODEL = "gemini-3.5-flash"

CATEGORIES = [
    "Backend",
    "Frontend",
    "InteligÃªncia Artificial",
    "AutomaÃ§Ã£o",
    "APIs",
    "DevOps",
    "QA",
    "Banco de Dados",
    "IntegraÃ§Ãµes",
    "Cloud",
    "Ferramentas",
    "Soft Skills",
]

ENTITY_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "name": {"type": "STRING"},
        "category": {"type": "STRING"},
        "description": {"type": "STRING"},
        "evidence": {"type": "STRING"},
    },
    "required": ["name", "category", "description"],
}

PROJECT_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "name": {"type": "STRING"},
        "category": {"type": "STRING"},
        "description": {"type": "STRING"},
        "technologies": {"type": "ARRAY", "items": {"type": "STRING"}},
        "evidence": {"type": "STRING"},
    },
    "required": ["name", "category", "description"],
}

ANALYSIS_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "summary": {"type": "STRING"},
        "skills": {"type": "ARRAY", "items": ENTITY_SCHEMA},
        "technologies": {"type": "ARRAY", "items": ENTITY_SCHEMA},
        "tools": {"type": "ARRAY", "items": ENTITY_SCHEMA},
        "projects": {"type": "ARRAY", "items": PROJECT_SCHEMA},
        "experiences": {"type": "ARRAY", "items": ENTITY_SCHEMA},
        "highlights": {"type": "ARRAY", "items": ENTITY_SCHEMA},
    },
    "required": [
        "summary",
        "skills",
        "technologies",
        "tools",
        "projects",
        "experiences",
        "highlights",
    ],
}


class GeminiProvider(AIProvider):
    """Provedor baseado no SDK oficial google-genai."""

    def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
        api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY nao encontrada. Crie um .env a partir do .env.example."
            )

        try:
            from google import genai
            from google.genai import types
        except ImportError as exc:
            raise RuntimeError(
                "Dependencias ausentes. Execute: pip install -r ai-cv/requirements.txt"
            ) from exc

        self._types = types
        self.client = genai.Client(api_key=api_key)
        self.model = model or os.getenv("GEMINI_MODEL") or DEFAULT_MODEL

    def analyze(
        self,
        content: str,
        *,
        source_path: str,
        existing_cv: Mapping[str, Any] | None = None,
    ) -> dict[str, Any]:
        prompt = build_prompt(content, source_path=source_path, existing_cv=existing_cv)

        logger.info("Enviando %s para analise com Gemini (%s)", source_path, self.model)
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=self._types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json",
                response_schema=ANALYSIS_SCHEMA,
            ),
        )

        payload = getattr(response, "parsed", None)
        if payload is None:
            payload = parse_json_response(getattr(response, "text", ""))

        if not isinstance(payload, dict):
            raise RuntimeError("A resposta do Gemini nao retornou um objeto JSON valido.")

        return normalize_analysis(payload)


def build_prompt(
    content: str,
    *,
    source_path: str,
    existing_cv: Mapping[str, Any] | None = None,
) -> str:
    template = load_prompt_template()
    known_items = summarize_existing_cv(existing_cv or {})
    return (
        template.replace("{{SOURCE_PATH}}", source_path)
        .replace("{{CATEGORIES}}", ", ".join(CATEGORIES))
        .replace("{{KNOWN_ITEMS}}", known_items or "Nenhum dado previo encontrado.")
        .replace("{{CONTENT}}", content.strip())
    )


def load_prompt_template() -> str:
    if PROMPT_TEMPLATE_PATH.exists():
        return PROMPT_TEMPLATE_PATH.read_text(encoding="utf-8")

    return (
        "Analise a anotacao bruta abaixo e extraia dados profissionais para um "
        "curriculo tecnico. Responda apenas JSON valido.\n\n"
        "Arquivo: {{SOURCE_PATH}}\n"
        "Categorias: {{CATEGORIES}}\n"
        "Itens ja conhecidos: {{KNOWN_ITEMS}}\n\n"
        "Conteudo:\n{{CONTENT}}\n"
    )


def summarize_existing_cv(existing_cv: Mapping[str, Any]) -> str:
    lines: list[str] = []
    for section in ("skills", "technologies", "tools", "projects", "experiences"):
        values = []
        for item in existing_cv.get(section, []):
            if isinstance(item, dict):
                name = item.get("name") or item.get("title")
                if name:
                    values.append(str(name))
        if values:
            lines.append(f"{section}: {', '.join(values[:40])}")
    return "\n".join(lines)[:2500]


def parse_json_response(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if not cleaned:
        raise RuntimeError("A resposta do Gemini veio vazia.")

    fenced = re.search(r"```(?:json)?\s*(.*?)```", cleaned, flags=re.DOTALL)
    if fenced:
        cleaned = fenced.group(1).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Nao foi possivel interpretar o JSON retornado pelo Gemini.") from exc


def normalize_analysis(payload: Mapping[str, Any]) -> dict[str, Any]:
    normalized: dict[str, Any] = {"summary": str(payload.get("summary", "")).strip()}
    for key in ("skills", "technologies", "tools", "projects", "experiences", "highlights"):
        value = payload.get(key, [])
        normalized[key] = value if isinstance(value, list) else []
    return normalized

