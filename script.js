const topics = {
  aspect: `
    <h2>ASPECT</h2>
    <p><strong>A</strong>cción - <strong>S</strong>ujeto - <strong>P</strong>ropósito - <strong>E</strong>jemplos - <strong>C</strong>ontraints - <strong>T</strong>ono</p>
    <p>La técnica ASPECT asegura que ningún elemento crítico falte en tu prompt. Ideal para crear instrucciones claras, completas y reutilizables.</p>
    <ul>
      <li><strong>Acción:</strong> ¿Qué debe hacer?</li>
      <li><strong>Sujeto:</strong> ¿Sobre qué?</li>
      <li><strong>Propósito:</strong> ¿Para qué se necesita?</li>
      <li><strong>Ejemplos:</strong> Ejemplo(s) de salida esperada.</li>
      <li><strong>Restricciones:</strong> Límites de formato, tokens, estilo.</li>
      <li><strong>Tono:</strong> Formal, técnico, casual, etc.</li>
    </ul>
    <h3>Ejemplo Práctico</h3>
    <pre>### ACCIÓN Resume<br>### SUJETO Informe financiero Q1<br>### PROPÓSITO Presentar a directivos<br>### EJEMPLO "Ingresos ↑ 12%"<br>### RESTRICCIONES ≤ 120 palabras, viñetas<br>### TONO Ejecutivo</pre>
    <h3>Ventajas</h3>
    <ul>
      <li>Mejora la claridad ejecutiva</li>
      <li>Aumenta precisión en salidas</li>
      <li>Fácil de documentar y compartir</li>
    </ul>
    <h3>Variantes de Aplicación</h3>
    <p>Se puede usar ASPECT para:</p>
    <ul>
      <li>Resúmenes ejecutivos</li>
      <li>Generación de reportes</li>
      <li>Clasificación semántica</li>
    </ul>
    <h3>Ejemplo Variante</h3>
    <pre>### ACCIÓN Clasifica<br>### SUJETO Reseña de app<br>### PROPÓSITO Detectar sentimiento<br>### EJEMPLO "Me encanta" → positivo<br>### RESTRICCIONES JSON, ≤1 línea<br>### TONO Neutral</pre>
  `,

  cot: `
    <h2>Chain-of-Thought (CoT)</h2>
    <p>Hace que el modelo razone paso a paso antes de dar una respuesta final. Es especialmente útil para tareas lógicas, matemáticas o con múltiples pasos.</p>
    <h3>Ejemplo</h3>
    <pre>### TAREA<br>¿Cuántos días hay entre 12-feb-2024 y 20-mar-2024?<br>### INSTRUCCIÓN<br>Razona paso a paso:<br>1. Febrero 2024 tiene 29 días (año bisiesto).<br>2. Del 12 al 29 de febrero: 17 días.<br>3. Marzo: 20 días.<br>4. Total: 17 + 20 = 37 días.</pre>
    <p>Resultado: <code>37</code></p>
    <h3>Cuándo Usarlo</h3>
    <ul>
      <li>Tareas complejas que requieren razonamiento lógico</li>
      <li>Problemas matemáticos o científicos</li>
      <li>Respuestas que necesitan justificación interna</li>
    </ul>
    <h3>Ejemplo Alternativo</h3>
    <pre>### TAREA<br>Explica por qué un algoritmo O(n log n) puede superar a O(n) en casos pequeños.<br>### INSTRUCCIÓN<br>Razona paso a paso:<br>1. La notación Big O describe crecimiento asintótico.<br>2. Para n pequeño, las constantes afectan más que la curva.<br>3. Un algoritmo O(n) puede tener overhead mayor.<br>4. En datos pequeños, O(n log n) puede ser más rápido.</pre>
  `,

  layering: `
    <h2>Prompt Layering</h2>
    <p>Divide una tarea compleja en capas secuenciales. Cada capa resuelve una parte y pasa su salida a la siguiente.</p>
    <h3>Ejemplo: Análisis de Feedback</h3>
    <ol>
      <li><strong>Capa 1:</strong> Extraer entidades clave → lista.</li>
      <li><strong>Capa 2:</strong> Clasificar sentimientos → tabla.</li>
      <li><strong>Capa 3:</strong> Generar informe ejecutivo → texto.</li>
    </ol>
    <h3>Ejemplo Avanzado</h3>
    <pre>### CAPA 1 – EXTRAER_ENTIDADES<br>{{feedback}}<br>### CAPA 2 – CLASIFICAR_SENTIMIENTO<br>De cada entidad: positivo/negativo/neutro<br>### CAPA 3 – GENERAR_INFORME<br>Resume hallazgos en ≤120 palabras, bullet points</pre>
    <h3>Ventajas</h3>
    <ul>
      <li>Menor token burst por llamada</li>
      <li>Reutilización de capas previas</li>
      <li>Mejor depuración y control</li>
    </ul>
  `,

  instructive: `
    <h2>Instructive Prompting</h2>
    <p>Se centra en normas estrictas de formato y estilo, ideal para automatización y sistemas que procesan respuestas estructuradas.</p>
    <h3>Ejemplo JSON</h3>
    <pre>{ "task":"classify", "subject":"{{texto}}", "labels":["positive","negative","neutral"], "constraints":{ "format":"csv", "max_tokens": 50 }}</pre>
    <h3>Ejemplo YAML</h3>
    <pre>steps:
- extract_entities: "{{texto}}"
- sentiment_analysis: true
- summary:
    length: 120
    format: markdown</pre>
    <h3>Usos Comunes</h3>
    <ul>
      <li>Generación de datos estructurados</li>
      <li>Integración con pipelines de datos</li>
      <li>Interfaces programáticas (APIs)</li>
    </ul>
  `,

  ipr: `
    <h2>Iterative Prompt Refinement (IPR)</h2>
    <p>Proceso cíclico: Prompt → Resultado → Evaluación → Ajuste. Permite mejorar gradualmente los prompts hasta alcanzar el nivel deseado.</p>
    <h3>Ejemplo Básico</h3>
    <pre>for v in range(3):
  out = llm(prompt)
  score = evaluator(out)
  if score > 0.9: break
  prompt = refine(prompt, feedback=out)</pre>
    <h3>Ejemplo Realista</h3>
    <pre>### VERSION 1<br>Resume esto en 120 palabras.<br>### RESULTADO<br>Demasiado largo y poco claro.<br>### VERSION 2<br>Resume en ≤120 palabras, bullet points, sin opiniones.<br>### RESULTADO<br>Breve y objetivo → aceptado.</pre>
    <h3>Métricas Útiles</h3>
    <ul>
      <li>Precisión factual</li>
      <li>Relevancia temática</li>
      <li>Número de tokens</li>
      <li>Calidad semántica (BERTScore, BLEU)</li>
    </ul>
  `,
};

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

function loadTopic(topic) {
  const contentDiv = document.getElementById("topicContent");
  if (topics[topic]) {
    contentDiv.innerHTML = topics[topic];
  } else {
    contentDiv.innerHTML = "<p>Contenido no disponible.</p>";
  }
}

function filterMenu(query) {
  query = query.toLowerCase();
  const menu = document.getElementById("menu");
  menu.innerHTML = "";
  Object.keys(topics).forEach(key => {
    if (key.toLowerCase().includes(query)) {
      menu.innerHTML += `<li><button onclick="loadTopic('${key}')">${key}</button></li>`;
    }
  });
}

window.onload = () => {
  const menu = document.getElementById("menu");
  Object.keys(topics).forEach(key => {
    menu.innerHTML += `<li><button onclick="loadTopic('${key}')">${key}</button></li>`;
  });
};
