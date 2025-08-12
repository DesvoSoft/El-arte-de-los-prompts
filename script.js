/* =========================================
   Contenido educativo de técnicas
   - Cada técnica tiene: title + html
========================================= */

const topics = {
  aspect: {
    title: "ASPECT",
    html: `
      <h2>ASPECT</h2>
      <p><strong>A</strong>cción · <strong>S</strong>ujeto · <strong>P</strong>ropósito · <strong>E</strong>jemplos · <strong>C</strong>onstraints · <strong>T</strong>ono.</p>
      <p>Marco para no olvidar ningún elemento crítico del prompt y mejorar consistencia.</p>
      <h3>Plantilla</h3>
      <pre>### ACCIÓN: &lt;qué debe hacer&gt;
### SUJETO: &lt;sobre qué&gt;
### PROPÓSITO: &lt;para qué&gt;
### EJEMPLO(S): &lt;1–3 salidas esperadas&gt;
### RESTRICCIONES: &lt;formato, longitud, estilo, tokens&gt;
### TONO: &lt;ej. ejecutivo, docente, técnico&gt;</pre>
      <h3>Ejemplo</h3>
      <pre>### ACCIÓN Resume
### SUJETO Informe financiero Q1
### PROPÓSITO Preparar junta directiva
### EJEMPLOS "Ingresos ↑ 12%", "Margen 34% (+2 pp)"
### RESTRICCIONES ≤ 120 palabras, viñetas
### TONO Ejecutivo</pre>
      <h3>Buenas prácticas</h3>
      <ul>
        <li>Limita la longitud con metas claras (palabras, secciones).</li>
        <li>Incluye <em>1–3 ejemplos</em> representativos; evita saturación.</li>
        <li>Especifica formato (JSON/tabla/markdown) cuando sea necesario.</li>
      </ul>
    `
  },

  cot: {
    title: "Chain-of-Thought (CoT)",
    html: `
      <h2>Chain-of-Thought (CoT)</h2>
      <p>Fomenta razonamiento paso a paso antes de la respuesta final. Útil en lógica, matemáticas y tareas multietapa.</p>
      <h3>Ejemplo</h3>
      <pre>### TAREA
¿Cuántos días hay entre 12-feb-2024 y 20-mar-2024?
### INSTRUCCIÓN
Razona paso a paso y luego da una respuesta final al final en la forma: "Días: &lt;número&gt;".</pre>
      <h3>Tip</h3>
      <ul>
        <li>Pide <em>“razona paso a paso y al final responde en una sola línea”</em> para separar proceso de salida.</li>
        <li>En evaluaciones, puedes pedir “<em>explica tu razonamiento a alto nivel</em>” para evitar detalles excesivos.</li>
      </ul>
    `
  },

  layering: {
    title: "Prompt Layering",
    html: `
      <h2>Prompt Layering</h2>
      <p>Divide la tarea en capas: extracción → análisis → síntesis. Reduce errores y facilita depuración.</p>
      <h3>Pipeline ejemplo</h3>
      <ol>
        <li><strong>Extraer</strong> entidades clave → lista.</li>
        <li><strong>Clasificar</strong> sentimiento por entidad → tabla.</li>
        <li><strong>Resumir</strong> hallazgos → informe ejecutivo.</li>
      </ol>
      <pre>### CAPA 1 – EXTRAER_ENTIDADES
{{feedback}}
### CAPA 2 – CLASIFICAR_SENTIMIENTO
Por cada entidad: positivo/negativo/neutro
### CAPA 3 – INFORME
Bullets, ≤120 palabras</pre>
      <h3>Buenas prácticas</h3>
      <ul>
        <li>Define entradas y salidas intermedias claras (contratos).</li>
        <li>Valida cada capa antes de encadenar.</li>
      </ul>
    `
  },

  instructive: {
    title: "Instructive Prompting",
    html: `
      <h2>Instructive Prompting</h2>
      <p>Respuestas estrictas y estructuradas para integraciones o automatizaciones.</p>
      <h3>JSON</h3>
      <pre>{
  "task":"classify",
  "subject":"{{texto}}",
  "labels":["positive","negative","neutral"],
  "constraints":{"format":"csv","max_tokens":120}
}</pre>
      <h3>YAML</h3>
      <pre>steps:
- extract_entities: "{{texto}}"
- sentiment_analysis: true
- summary:
    length: 120
    format: markdown</pre>
      <h3>Consejos</h3>
      <ul>
        <li>Incluye validaciones (“si no puedes, devuelve reason”).</li>
        <li>Especifica orden de campos y tipos esperados.</li>
      </ul>
    `
  },

  ipr: {
    title: "Iterative Prompt Refinement (IPR)",
    html: `
      <h2>Iterative Prompt Refinement (IPR)</h2>
      <p>Mejora por ciclos: Prompt → Resultado → Evaluación → Ajuste.</p>
      <h3>Plantilla</h3>
      <pre>for v in range(3):
  out = llm(prompt)
  score = evaluator(out)
  if score &gt;= 0.9: break
  prompt = refine(prompt, feedback=out)</pre>
      <h3>Indicadores</h3>
      <ul>
        <li>Precisión factual y cobertura.</li>
        <li>Costo de tokens y latencia.</li>
        <li>Consistencia de formato.</li>
      </ul>
      <h3>Tip</h3>
      <p>Guarda variantes de prompt y salidas para comparar y elegir la mejor.</p>
    `
  },

  zero_shot: {
    title: "Zero-shot",
    html: `
      <h2>Zero-shot Prompting</h2>
      <p>Instrucción directa sin ejemplos. Rápido de escribir; sensible a la ambigüedad.</p>
      <h3>Ejemplo</h3>
      <pre>Actúa como guía técnico y explica en ≤100 palabras qué es una API REST para principiantes.</pre>
      <h3>Cuándo usar</h3>
      <ul>
        <li>Definiciones, resúmenes, tareas frecuentes.</li>
        <li>Cuando la instrucción es inequívoca.</li>
      </ul>
      <h3>Riesgos</h3>
      <p>Si notas variabilidad en el estilo o contenido, migra a Few-shot.</p>
    `
  },

  few_shot: {
    title: "Few-shot",
    html: `
      <h2>Few-shot Prompting</h2>
      <p>Proporciona 2–5 ejemplos representativos para fijar estilo y formato.</p>
      <h3>Ejemplo</h3>
      <pre>### TAREA
Clasifica reseñas en {positivo, negativo}.
### EJEMPLOS
"Me encantó" → positivo
"Se dañó a los 3 días" → negativo
### TEXTO
"Funciona bien pero llegó tarde"</pre>
      <h3>Consejos</h3>
      <ul>
        <li>Ejemplos cortos y variados; no contradigas la consigna.</li>
        <li>Coloca el ejemplo más representativo primero.</li>
      </ul>
    `
  },

  role_based: {
    title: "Role-based",
    html: `
      <h2>Role-based Prompting</h2>
      <p>Define un rol para activar conocimientos, estilo y restricciones propias de ese perfil.</p>
      <h3>Ejemplo</h3>
      <pre>Eres un auditor de datos. Revisa el siguiente CSV y lista 3 anomalías con breve justificación (≤20 palabras cada una).</pre>
      <h3>Tips</h3>
      <ul>
        <li>Incluye objetivos: “optimiza X”, “evita Y”.</li>
        <li>Aclara límites éticos y de seguridad si aplica.</li>
      </ul>
    `
  },

  meta_prompting: {
    title: "Meta-prompting",
    html: `
      <h2>Meta-prompting</h2>
      <p>Pide al modelo que diseñe su plan/prompt antes de responder. Útil para problemas abiertos o poco definidos.</p>
      <h3>Ejemplo</h3>
      <pre>Primero, propone un plan de 3 pasos para resolver esta tarea (solo bullets).
Luego, ejecútalo y entrega el resultado final.</pre>
      <h3>Beneficio</h3>
      <p>Mejor planificación y menor deriva temática.</p>
    `
  },

  prompt_chaining: {
    title: "Prompt Chaining",
    html: `
      <h2>Prompt Chaining</h2>
      <p>Encadena prompts: la salida A alimenta el prompt B. Ideal para pipelines.</p>
      <h3>Ejemplo</h3>
      <pre>(A) Normaliza nombres de producto → (B) Agrupa por categoría → (C) Crea reporte con KPIs.</pre>
      <h3>Buenas prácticas</h3>
      <ul>
        <li>Define formatos intermedios (JSON/CSV) consistentes.</li>
        <li>Registra logs de cada etapa para auditoría.</li>
      </ul>
    `
  },

  evaluation: {
    title: "Evaluación y Optimización",
    html: `
      <h2>Evaluación y Optimización</h2>
      <p>Cómo medir efectividad de tus prompts y reducir costo.</p>
      <h3>Métricas</h3>
      <ul>
        <li><strong>Calidad</strong>: precisión factual, cobertura, coherencia.</li>
        <li><strong>Formato</strong>: cumplimiento de esquema (JSON válido).</li>
        <li><strong>Eficiencia</strong>: tokens/latencia por tarea.</li>
      </ul>
      <h3>Técnicas</h3>
      <ul>
        <li>Validadores: “si no puedes, devuelve {"reason": "..."}”.</li>
        <li>Compresión: pide respuestas concisas o tablas.</li>
        <li>Plantillas reutilizables y versionadas.</li>
      </ul>
    `
  },

  errores_comunes: {
    title: "Errores comunes",
    html: `
      <h2>Errores comunes al crear prompts</h2>
      <ul>
        <li><strong>Ambigüedad</strong>: no definir objetivo ni formato → <em>Solución</em>: ASPECT.</li>
        <li><strong>Ejemplos contradictorios</strong>: Few-shot mal curado → <em>Solución</em>: filtra y ordena.</li>
        <li><strong>Exceso de longitud</strong> que induce deriva → <em>Solución</em>: sintetiza, usa pasos.</li>
        <li><strong>Falta de validación</strong> de salidas → <em>Solución</em>: reglas y checks.</li>
      </ul>
      <h3>Checklist rápido</h3>
      <pre>[ ] Objetivo claro
[ ] Formato definido
[ ] 1–3 ejemplos correctos
[ ] Restricciones de longitud/estilo
[ ] Revisión de salidas</pre>
    `
  }
};

/* =========================================
   Utilidades UI
========================================= */

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

function loadTopic(key) {
  const contentDiv = document.getElementById("topicContent");
  const item = topics[key];
  if (!item) {
    contentDiv.innerHTML = "<p>Contenido no disponible.</p>";
    return;
  }
  contentDiv.innerHTML = item.html;

  // Estado activo en el menú
  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.menu button[data-key="${key}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  // Accesibilidad: enfocar contenido principal
  const main = document.getElementById("main");
  if (main) main.focus({ preventScroll: false });
  // Scrollear arriba del contenido si es necesario
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================
   Construcción de menú y extras
========================================= */

function buildMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  // Limpia
  menu.innerHTML = "";

  // Orden de aparición sugerido
  const order = [
    "aspect","cot","layering","instructive","ipr",
    "zero_shot","few_shot","role_based","meta_prompting","prompt_chaining",
    "evaluation","errores_comunes"
  ];

  order.forEach(key => {
    if (!topics[key]) return;
    const btn = document.createElement("button");
    btn.setAttribute("data-key", key);
    btn.type = "button";
    btn.innerText = topics[key].title;
    btn.addEventListener("click", () => loadTopic(key));
    menu.appendChild(document.createElement("li")).appendChild(btn);
  });
}

/* =========================================
   Modo lectura (ocultar/mostrar sidebar)
   - No requiere tocar HTML/CSS: inyecta estilos
========================================= */

function injectReaderStyles() {
  const css = `
    .reader-toggle {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 9999;
      border: 0;
      border-radius: 999px;
      padding: 0.65rem 0.95rem;
      font-weight: 600;
      cursor: pointer;
      background: linear-gradient(135deg, var(--accent-2), var(--accent-4));
      color: #0b0d12;
      box-shadow: 0 10px 20px rgba(0,0,0,0.25);
    }
    .sidebar.hidden-by-reader {
      display: none !important;
    }
  `;
  const style = document.createElement("style");
  style.id = "reader-style";
  style.textContent = css;
  document.head.appendChild(style);
}

function addReaderToggle() {
  injectReaderStyles();

  const btn = document.createElement("button");
  btn.className = "reader-toggle";
  btn.type = "button";
  btn.title = "Modo lectura (oculta/mostrar la barra lateral)";
  btn.textContent = "Modo lectura";

  btn.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("hidden-by-reader");
  });

  document.body.appendChild(btn);
}

/* =========================================
   Inicio
========================================= */

window.addEventListener("load", () => {
  buildMenu();
  addReaderToggle();
  // Carga inicial: deja la guía rápida que está en el HTML,
  // pero si prefieres abrir una técnica por defecto, descomenta:
  // loadTopic("aspect");
});
