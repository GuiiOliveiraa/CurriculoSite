from __future__ import annotations

import argparse
import hashlib
import logging
import os
import sys
from pathlib import Path
from typing import Any

from update_cv import (
    default_cv,
    default_processed_files,
    ensure_cv_shape,
    load_json,
    merge_analysis,
    now_iso,
    remove_deleted_processed_entries,
    save_json,
)


ROOT_DIR = Path(__file__).resolve().parents[1]
SUPPORTED_SUFFIXES = {".md", ".txt"}


def main() -> int:
    args = parse_args()
    configure_logging()
    load_environment()

    knowledge_dir = resolve_path(args.knowledge_dir)
    data_dir = resolve_path(args.data_dir)
    cv_path = data_dir / "cv.json"
    processed_path = data_dir / "processed_files.json"

    cv = ensure_cv_shape(load_json(cv_path, default_cv))
    processed = load_json(processed_path, default_processed_files)

    files = list(iter_knowledge_files(knowledge_dir))
    hashes = {relative_key(path): sha256_file(path) for path in files}
    remove_deleted_processed_entries(processed, hashes.keys())

    changed_files = [
        path
        for path in files
        if args.full
        or processed.get("files", {}).get(relative_key(path), {}).get("hash") != hashes[relative_key(path)]
    ]

    if not changed_files:
        logging.info("Nenhum arquivo novo ou modificado encontrado em %s.", knowledge_dir)
        if not args.dry_run:
            processed["last_run"] = now_iso()
            save_json(processed_path, processed)
        return 0

    logging.info("%s arquivo(s) para processar.", len(changed_files))
    for path in changed_files:
        logging.info("- %s", relative_key(path))

    if args.dry_run:
        logging.info("Dry-run concluido. Nenhum dado foi alterado.")
        return 0

    provider = build_provider(args.provider, model=args.model)
    errors = 0

    for path in changed_files:
        key = relative_key(path)
        content_hash = hashes[key]
        content = read_text_file(path)

        if not content.strip():
            logging.warning("%s esta vazio; marcando como ignorado.", key)
            processed.setdefault("files", {})[key] = {
                "hash": content_hash,
                "last_processed_at": now_iso(),
                "status": "ignored_empty",
            }
            continue

        try:
            analysis = provider.analyze(content, source_path=key, existing_cv=cv)
            cv = merge_analysis(cv, analysis, source_path=key, content_hash=content_hash)
            processed.setdefault("files", {})[key] = {
                "hash": content_hash,
                "last_processed_at": now_iso(),
                "status": "processed",
            }
            logging.info("%s processado com sucesso.", key)
        except Exception as exc:  # noqa: BLE001 - CLI precisa registrar e seguir para os proximos arquivos.
            errors += 1
            logging.exception("Falha ao processar %s: %s", key, exc)

    processed["last_run"] = now_iso()
    save_json(cv_path, cv)
    save_json(processed_path, processed)

    if errors:
        logging.error("Processamento finalizado com %s erro(s).", errors)
        return 1

    logging.info("Curriculo vivo atualizado em %s.", cv_path)
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Processa arquivos livres em knowledge/ e atualiza data/cv.json."
    )
    parser.add_argument(
        "--full",
        "--reprocess-all",
        action="store_true",
        help="Reprocessa todos os arquivos, ignorando hashes salvos.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Lista arquivos que seriam processados sem chamar a IA nem alterar JSON.",
    )
    parser.add_argument(
        "--provider",
        default="gemini",
        choices=["gemini"],
        help="Provedor de IA. A arquitetura permite adicionar novos provedores depois.",
    )
    parser.add_argument(
        "--model",
        default=os.getenv("GEMINI_MODEL"),
        help="Modelo Gemini. Padrao: GEMINI_MODEL ou gemini-3.5-flash.",
    )
    parser.add_argument(
        "--knowledge-dir",
        default="knowledge",
        help="Pasta com arquivos .txt ou .md.",
    )
    parser.add_argument(
        "--data-dir",
        default="data",
        help="Pasta onde cv.json e processed_files.json ficam salvos.",
    )
    return parser.parse_args()


def configure_logging() -> None:
    log_dir = ROOT_DIR / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(log_dir / "cv_processing.log", encoding="utf-8"),
        ],
    )


def load_environment() -> None:
    try:
        from dotenv import load_dotenv
    except ImportError:
        logging.warning(
            "python-dotenv nao esta instalado; variaveis exportadas no sistema ainda serao usadas."
        )
        return

    load_dotenv(ROOT_DIR / ".env")


def build_provider(provider_name: str, *, model: str | None):
    if provider_name != "gemini":
        raise ValueError(f"Provedor nao suportado: {provider_name}")

    from gemini_client import GeminiProvider

    return GeminiProvider(model=model)


def resolve_path(value: str) -> Path:
    path = Path(value)
    if not path.is_absolute():
        path = ROOT_DIR / path
    return path.resolve()


def iter_knowledge_files(knowledge_dir: Path):
    if not knowledge_dir.exists():
        logging.warning("Pasta %s nao existe. Criando agora.", knowledge_dir)
        knowledge_dir.mkdir(parents=True, exist_ok=True)
        return

    for path in sorted(knowledge_dir.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED_SUFFIXES:
            yield path


def relative_key(path: Path) -> str:
    return path.resolve().relative_to(ROOT_DIR).as_posix()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_text_file(path: Path) -> str:
    for encoding in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("unknown", b"", 0, 1, f"Nao foi possivel ler {path}")


if __name__ == "__main__":
    raise SystemExit(main())
