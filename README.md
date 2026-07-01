# Currículo Vivo

O projeto agora está dividido em duas partes independentes:

- `site/`: o currículo online, com a interface e os dados renderizados.
- `ai-cv/`: a automação que lê anotações, chama a IA e atualiza os dados do site.

Essa separação deixa o front-end limpo e permite evoluir a automação sem misturar responsabilidades.

## Estrutura

- `site/index.html`, `site/style.css`, `site/script.js`: front-end do currículo.
- `site/assets/Foto.png`: imagem usada no site.
- `site/data/cv.json`: fonte de dados consumida pelo site.
- `site/data/processed_files.json`: controle de arquivos já processados.
- `ai-cv/knowledge/`: textos `.txt` ou `.md` com aprendizados, projetos, experiências e tecnologias.
- `ai-cv/scripts/process_knowledge.py`: identifica arquivos novos ou alterados por hash e coordena o processamento.
- `ai-cv/scripts/gemini_client.py`: implementa o provedor Gemini usando o SDK oficial `google-genai`.
- `ai-cv/scripts/ai_provider.py`: contrato base para adicionar novos provedores depois.
- `ai-cv/scripts/update_cv.py`: mescla resultados no `site/data/cv.json`, evita duplicações e preserva histórico.
- `ai-cv/templates/gemini_analysis_prompt.md`: prompt usado para extrair dados estruturados.
- `ai-cv/logs/`: logs do processamento.

## Instalação

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ai-cv/requirements.txt
copy ai-cv/.env.example ai-cv/.env
```

Depois edite `ai-cv/.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.5-flash
```

## Uso

Crie um arquivo em `ai-cv/knowledge/`, por exemplo `ai-cv/knowledge/n8n-whatsapp.md`:

```text
Aprendi N8N e construí fluxos automatizados conectando APIs externas.
Também implementei uma integração entre Evolution API e WhatsApp Cloud API.
```

Veja o que seria processado:

```bash
python ai-cv/scripts/process_knowledge.py --dry-run
```

Atualize o currículo:

```bash
python ai-cv/scripts/process_knowledge.py
```

Forçar reprocessamento completo:

```bash
python ai-cv/scripts/process_knowledge.py --full
```

## Manutenção

- Escreva anotações livres em `ai-cv/knowledge/`.
- Rode o script sempre que quiser atualizar o currículo.
- O script só chama a IA para arquivos novos ou modificados.
- `site/data/cv.json` pode ser versionado, pois não contém segredo.
- `site/data/processed_files.json` guarda hashes para evitar reprocessamento desnecessário.
- `site/data/cv.json` mantém o histórico das análises em `knowledge_history`.
- Logs ficam em `ai-cv/logs/cv_processing.log`.

## Site

O front-end carrega `site/data/cv.json` e renderiza habilidades, tecnologias, projetos, experiências e destaques. Para testar localmente com `fetch`, use um servidor simples:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000/site/`.

## Referências técnicas

- SDK Python oficial: https://googleapis.github.io/python-genai/
- Gemini API Generate Content: https://ai.google.dev/api/generate-content
