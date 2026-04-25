#   ____                                    __               
#  / ___| ___ _ __ ___  _ __ ___   ___ _ __ | |_ ___  ___ 
# | |   / _ \ '_ ` _ \| '_ ` _ \ / _ \ '_ \| __/ _ \/ __|
# | |___|  __/ | | | | | | | | | |  __/ | | ||  __/(__ 
#  \____|\___|_| |_| |_|_| |_| |_|\___|_|  _|\___\___|
#                                                
#  _____        __ _     _   _       
# | ____|_   _ / _(_)___| |_| |__   
# |  _|| | | || |_|/ __| __| '_ \  
# | |___| |_| ||  _| (__| |_| | | | 
# |_____\__,_||_| |___|\__|_| |_| |
#                                   
#  El Arte de los Prompts
#  ===================

**El Arte de los Prompts** es una plataforma de referencia técnica para 
dominar la ingeniería de prompts y context engineering. Documentación 
profesional con técnicas probadas, patrones reutilizables y seguridad.

---

## Quick View

```
┌─────────────────────────────────────────────────────────┐
│  Landing (index.html)          Content (content.html)  │
│  ──────────────────          ────────────────────────  │
│  • Hero con estadísticas      • Sidebar con secciones  │
│  • Grid de secciones         • Técnicas renderizadas  │
│  • Theme toggle ☀/☾         • Búsqueda integrada      │
│  • Partículas flotantes       • URLs ?section=id        │
└─────────────────────────────────────────────────────────┘
```

---

## Técnicas Documentadas

| # | Sección      | Técnicas                |
|---|--------------|------------------------|
| 01 | Fundamentos | Contexto, Economía     |
| 02 | Técnicas    | Anatomía, CoT, Zero    |
| 03 | RAG         | Chunking, Re-ranking   |
| 04 | Agentes     | Function calling      |
| 05 | Optimización | Ventana contexto    |
| 06 | Seguridad  | Evaluación, Debugging |

> Total: **20+ técnicas** con ejemplos, pasos y mejores prácticas

---

## Demo

```bash
# Local
git clone https://github.com/DesvoSoft/El-arte-de-los-prompts.git
cd El-arte-de-los-prompts
# Abrir index.html en navegador
```

**Live:** https://desvosoft.github.io/El-arte-de-los-prompts/

---

## Stack

```
┌────────────────────────────────────────┐
│  HTML5     │  CSS3 (embebido)  │  JS ES6+ │
│  ─────────────────────────────────────│
│  • No frameworks                     │
│  • CSS embebido (aislamiento)         │
│  • Vanilla JS                       │
│  • topics.json para contenido       │
└────────────────────────────────────────┘
```

---

## Features

| Feature         | Status |
|-----------------|--------|
| Theme toggle    | ✓      |
| Partículas      | ✓      |
| Sections grid   | ✓      |
| Dynamic menu   | ✓      |
| URL params      | ✓      |
| SEO ready       | ✓      |

---

## Architecture

```
/
├── index.html      # Landing page (self-contained)
├── content.html    # Content page dinámico
├── topics.json     # Base de técnicas
├── README.md       # Este archivo
└── .ai/            # Documentación interna
    ├── PROJECT.md
    ├── ROADMAP.md
    ├── CHECKLIST.md
    └─��� LOG.md
```

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| v1.0  | 2026-04 | Landing + Content pages modernos |
| v0.x  | 2025    | Iteraciones anteriores (legacy) |

---

## Credits

```
         _   _   ____            _        
  ___ __| | | | / ___| _   _ ___| | ___ _ 
 / _ \_  | | | | \___|| | | / __| |/ / '_|
|  __/ || | | | |___|| |_| \__ \   <| |_ 
 \___/_||_|_| |_|____|\__,_|___/_|\_\__|
                                        
Created by: DesvoSoft
Contact:   desvosoft @ github
```

---

**&copy; 2026 DesvoSoft** · Ingeniería de prompts para profesionales