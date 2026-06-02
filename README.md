# Currículo Vivo

Este projeto era um portfólio estático composto por `index.html`, `style.css`, `script.js` e `Foto.png`. A nova arquitetura mantém o site simples, mas separa o conteúdo evolutivo em `data/cv.json`, atualizado por scripts Python a partir de anotações livres em `knowledge/`.

## Arquitetura

- `knowledge/`: textos `.txt` ou `.md` com aprendizados, projetos, experiências e tecnologias.
- `scripts/process_knowledge.py`: identifica arquivos novos ou alterados por hash e coordena o processamento.
- `scripts/gemini_client.py`: implementa o provedor Gemini usando o SDK oficial `google-genai`.
- `scripts/ai_provider.py`: contrato base para adicionar OpenAI, Claude, DeepSeek, Grok ou outros provedores depois.
- `scripts/update_cv.py`: mescla resultados no `data/cv.json`, evita duplicações e preserva histórico.
- `data/cv.json`: fonte de dados consumida pelo site.
- `data/processed_files.json`: controle de arquivos já processados.
- `templates/gemini_analysis_prompt.md`: prompt usado para extrair dados estruturados.

## Instalação

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Depois edite `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.5-flash
```

O `.env` está no `.gitignore` para evitar expor a chave.

## Uso

Crie um arquivo em `knowledge/`, por exemplo `knowledge/n8n-whatsapp.md`:

```text
Aprendi N8N e construí fluxos automatizados conectando APIs externas.
Também implementei uma integração entre Evolution API e WhatsApp Cloud API.
```

Veja o que seria processado:

```bash
python scripts/process_knowledge.py --dry-run
```

Atualize o currículo:

```bash
python scripts/process_knowledge.py
```

Forçar reprocessamento completo:

```bash
python scripts/process_knowledge.py --full
```

## Manutenção

- Escreva anotações livres em `knowledge/`; não precisa formatar.
- Rode o script sempre que quiser atualizar o currículo.
- O script só chama a IA para arquivos novos ou modificados.
- `data/cv.json` pode ser versionado, pois não contém segredo.
- `data/processed_files.json` guarda hashes para evitar reprocessamento desnecessário.
- `data/cv.json.knowledge_history` mantém o histórico das análises.
- Logs ficam em `logs/cv_processing.log`.

## Site

O front-end carrega `data/cv.json` e renderiza habilidades, tecnologias, projetos, experiências e destaques. Para testar localmente com `fetch`, use um servidor simples:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Referências técnicas

- SDK Python oficial: https://googleapis.github.io/python-genai/
- Gemini API Generate Content: https://ai.google.dev/api/generate-content
