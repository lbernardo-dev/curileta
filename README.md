# Las Aventuras de Curileta — Web Oficial

Plataforma oficial del universo transmedia de **Las Aventuras de Curileta**. Construida bajo la filosofía de *«Una aventura continua»*, con experiencia de scrollytelling de alto impacto, arquitectura desacoplada y accesibilidad WCAG 2.2 AA.

---

## 🧭 Estructura del Monorepo

```text
curileta-web/
├── apps/
│   ├── web/                    # Next.js 15+ App Router, Server Components & Tailwind
│   └── studio/                 # Sanity Studio v3 (Headless CMS desacoplado)
├── packages/
│   ├── design-system/          # Tokens, CSS variables, componentes base accesibles
│   ├── motion/                 # MotionSceneEngine (Full, Adaptive, Reduced Motion)
│   ├── cms/                    # Cliente GROQ, modelos TypeScript y CMSProvider
│   ├── i18n/                   # Localización next-intl (ES / EN) y diccionarios
│   ├── analytics/              # Telemetría de negocio sin PII (privacidad infantil)
│   ├── seo/                    # Generadores de Schema.org JSON-LD
│   └── config/                 # Tsconfig y configuraciones compartidas
├── docs/                       # Especificaciones maestras y plan de implementación
└── tooling/                    # Scripts de auditoría y CI/CD
```

---

## 🚀 Inicio Rápido

### Requisitos previos
- **Node.js**: v22.18+ (necesario para el SDK de Supabase y la importación local de contenido a Sanity)
- **npm**: v10+

### Instalación de dependencias
```bash
npm install
```

### Ejecución en desarrollo
```bash
# Iniciar la aplicación web principal
npm run dev

# Iniciar Sanity Studio
npm run dev:studio

# Iniciar todos los entornos a la vez
npm run dev:all
```

La aplicación web estará disponible en [http://localhost:3000](http://localhost:3000) y Sanity Studio en [http://localhost:3333](http://localhost:3333).

---

## 🎨 Principios de Diseño y Accesibilidad

1. **El Personaje es el Hilo Conductor:** Curileta guía la interacción de forma viva.
2. **Scrollytelling sin Bloqueos:** `MotionSceneEngine` optimiza recursos según el dispositivo:
   - **Full Motion:** Escritorio con animaciones ricas y 3D.
   - **Adaptive Motion:** Móviles con transiciones suaves y carruseles táctiles.
   - **Reduced Motion:** Usuarios con `prefers-reduced-motion` activado.
3. **Privacidad Infantil Garantizada (RGPD-K / COPPA):**
   - Cero cookies invasivas de terceros.
   - Sin recopilación de datos personales de menores.
   - Formularios y canales profesionales estrictamente para adultos.

---

## 📄 Documentación

- [Documento Maestro de Producto](./Docs/Proyecto_Web_Oficial_Las_Aventuras_de_Curileta.md)
- [Plan de Implementación Operativo](./Docs/PLAN_IMPLEMENTACION.md)
- [Configuración del backend y conexión de servicios](./Docs/BACKEND_SETUP.md)
