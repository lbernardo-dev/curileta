# Las Aventuras de Curileta — Web Oficial

Plataforma oficial del universo transmedia de **Las Aventuras de Curileta**. Construida bajo la filosofía de *«Una aventura continua»*, con experiencia de scrollytelling de alto impacto, arquitectura desacoplada y accesibilidad WCAG 2.2 AA.

---

## 🧭 Estructura del Monorepo

```text
curileta-web/
├── apps/
│   ├── web/                    # Next.js App Router, panel /admin y API
│   └── studio/                 # Herramienta de migración histórica, fuera del runtime web
├── packages/
│   ├── design-system/          # Tokens, CSS variables, componentes base accesibles
│   ├── motion/                 # MotionSceneEngine (Full, Adaptive, Reduced Motion)
│   ├── cms/                    # Modelos TypeScript, proveedores Supabase y datos locales
│   ├── i18n/                   # Localización next-intl (ES / EN) y diccionarios
│   ├── analytics/              # Eventos agregados con controles de privacidad
│   ├── seo/                    # Generadores de Schema.org JSON-LD
│   └── config/                 # Tsconfig y configuraciones compartidas
├── docs/                       # Especificaciones maestras y plan de implementación
└── tooling/                    # Scripts de auditoría y CI/CD
```

---

## 🚀 Inicio Rápido

### Requisitos previos
- **Node.js**: v22.18+
- **npm**: v10+

### Instalación de dependencias
```bash
npm install
```

### Ejecución en desarrollo
```bash
# Iniciar la aplicación web principal
npm run dev
```

La aplicación web estará disponible en [http://localhost:3000](http://localhost:3000). El contenido editorial se lee y administra desde Supabase a través del panel protegido `/admin`; Sanity no forma parte del runtime de la web. El comando opcional `npm run dev:all` también inicia el Studio histórico de Sanity y no es necesario para trabajar con la web.

---

## 🎨 Principios de Diseño y Accesibilidad

1. **El Personaje es el Hilo Conductor:** Curileta guía la interacción de forma viva.
2. **Scrollytelling sin Bloqueos:** `MotionSceneEngine` optimiza recursos según el dispositivo:
   - **Full Motion:** Escritorio con animaciones ricas y 3D.
   - **Adaptive Motion:** Móviles con transiciones suaves y carruseles táctiles.
   - **Reduced Motion:** Usuarios con `prefers-reduced-motion` activado.
3. **Privacidad por diseño para una experiencia familiar:**
   - Google Analytics permanece desactivado por defecto; las señales DNT y GPC omiten las métricas agregadas propias.
   - Los controles antispam externos se cargan cuando se inicia una acción que los necesita.
   - El formulario profesional está dirigido a personas adultas; el responsable debe completar la revisión legal, contractual y de audiencia documentada en [la auditoría de privacidad](./Docs/PRIVACY_COMPLIANCE_AUDIT.md).

---

## 📄 Documentación

- [Documento Maestro de Producto](./Docs/Proyecto_Web_Oficial_Las_Aventuras_de_Curileta.md)
- [Plan de Implementación Operativo](./Docs/PLAN_IMPLEMENTACION.md)
- [Configuración del backend y conexión de servicios](./Docs/BACKEND_SETUP.md)
- [Referencia técnica viva del backend](./Docs/BACKEND_TECHNICAL_REFERENCE.md)
- [Auditoría de privacidad y cookies](./Docs/PRIVACY_COMPLIANCE_AUDIT.md)
