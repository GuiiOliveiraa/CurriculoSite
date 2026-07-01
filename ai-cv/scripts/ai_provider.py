from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Mapping


class AIProvider(ABC):
    """Contrato minimo para provedores de IA usados pelo curriculo vivo."""

    @abstractmethod
    def analyze(
        self,
        content: str,
        *,
        source_path: str,
        existing_cv: Mapping[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Analisa um texto bruto e retorna dados estruturados para o cv.json."""
        raise NotImplementedError
