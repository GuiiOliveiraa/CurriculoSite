Criei o CurriculoSite, um portfólio inteligente que se atualiza automaticamente via IA.

O sistema funciona assim:
- Eu escrevo anotações em Markdown em ai-cv/knowledge/
- Um script Python com Gemini IA processa as anotações
- Os dados estruturados (skills, projetos, experiências) são salvos em cv.json
- O frontend renderiza o site dinamicamente a partir do JSON

Tecnologias: Python, Gemini API, GitHub Actions, HTML/CSS/JS, JSON

O site tem dark mode, design moderno com Sora + Space Grotesk, micro-interações em hover,
grid de projetos em estilo Bento, renderização 100% dinâmica via JavaScript e agora suporta
alternância manual entre português e inglês direto na navegação.

Aprendizados principais:
- Integração com LLMs (Gemini, arquitetura extensível para Claude/OpenAI)
- Automação com GitHub Actions
- Separação de dados e template
- Sistema de processamento incremental com hashes

