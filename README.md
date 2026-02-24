cat << 'EOF' > README.md

# reloj-mundial

Aplicación **Reloj Mundial** hecha en **Angular**. Muestra:

- 🕒 Reloj analógico + hora y fecha digital por zona
- 🌍 Selector de país y ciudad (zona horaria + coordenadas)
- 🌤️ Clima actual y pronóstico de 7 días (Open-Meteo)
- 🎨 Temas (Océano / Atardecer / Bosque)
- 🌙 Modo claro / oscuro
- 💾 Persistencia con \`localStorage\`

---

## Requisitos

- Node.js (recomendado: versión LTS)
- Angular CLI (se puede usar con \`npx\`)

---

## Instalación

Instala dependencias:

\`\`\`bash
npm install
\`\`\`

## Servidor de desarrollo

Para levantar la app en local:

\`\`\`bash
npm start
\`\`\`

o también:

\`\`\`bash
ng serve
\`\`\`

Luego abre:

http://localhost:4200/

La aplicación se recargará automáticamente al guardar cambios.

---

## Generar código (scaffolding)

Angular CLI incluye herramientas para generar componentes, servicios, etc.

Ejemplo:

\`\`\`bash
ng generate component nombre-componente
\`\`\`

Para ver todas las opciones:

\`\`\`bash
ng generate --help
\`\`\`

---

## Compilar para producción

\`\`\`bash
ng build
\`\`\`

Los archivos finales se generan en \`dist/\`.

---

## Pruebas unitarias

\`\`\`bash
ng test
\`\`\`

---

## Pruebas end-to-end (e2e)

\`\`\`bash
ng e2e
\`\`\`

Angular CLI no incluye un framework e2e por defecto; puedes configurar el que prefieras.

---

## Créditos / Notas

Proyecto generado con Angular CLI.  
API de clima: Open-Meteo.

---

## Recursos

Documentación Angular CLI: https://angular.dev/tools/cli
EOF
