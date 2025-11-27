const SERVICES = {
  // ---------------- LANDING PAGE ----------------
  landing: {
    label: "Landing Page",
    plans: [
      {
        id: "landing-basic",
        name: "Básica",
        type: "oneTime",
        priceOneTime: 1100,
        features: [
          "Formulario de contacto",
          "Responsive",
          "Redes sociales",
          "Copywriting",
        ],
        addons: [
          {
            id: "landing-hosting",
            label: "Hosting + Dominio (1 año)",
            priceOneTime: 240,
          },
          {
            id: "landing-maint",
            label: "Mantenimiento mensual",
            priceMonthly: 200,
          },
        ],
      },
      {
        id: "landing-custom",
        name: "Personalizada",
        type: "oneTime",
        priceOneTime: 1500,
        features: [
          "Diseño exclusivo",
          "Animaciones",
          "Optimización SEO",
        ],
        addons: [
          {
            id: "landing-custom-hosting",
            label: "Hosting + Dominio (1 año)",
            priceOneTime: 240,
          },
          {
            id: "landing-custom-maint",
            label: "Mantenimiento mensual",
            priceMonthly: 200,
          },
          {
            id: "landing-hubspot",
            label: "Integración CRM / HubSpot",
            priceOneTime: 300,
          },
        ],
      },
      {
        id: "landing-advanced",
        name: "Avanzada",
        type: "oneTime",
        priceOneTime: 2300,
        features: [
          "SEO orgánico",
          "Diseño 100% personalizado",
          "Integración avanzada (CRM, automatizaciones)",
        ],
        addons: [
          {
            id: "landing-adv-hosting",
            label: "Hosting + Dominio (1 año)",
            priceOneTime: 240,
          },
          {
            id: "landing-adv-maint",
            label: "Mantenimiento mensual",
            priceMonthly: 200,
          },
          {
            id: "landing-adv-analytics-pixel",
            label: "total Google Analytics + Pixel",
            priceOneTime: 350,
          },
        ],
      },
    ],
  },

  // ---------------- REDISEÑO WEB ----------------
  redesign: {
    label: "Rediseño Web",
    plans: [
      {
        id: "redesign-lite",
        name: "Refresco Visual",
        type: "oneTime",
        priceOneTime: 500,
        features: [
          "Análisis visual del sitio actual",
          "Actualización de tipografías y colores",
          "Ajustes básicos de layout en páginas clave",
          "Mejoras ligeras de experiencia de usuario (UX)",
        ],
        addons: [
          {
            id: "redesign-lite-speed",
            label: "Optimización de velocidad (imágenes, caché)",
            priceOneTime: 180,
          },
          {
            id: "redesign-lite-maint",
            label: "Mantenimiento mensual",
            priceMonthly: 150,
          },
        ],
      },
      {
        id: "redesign-pro",
        name: "Rediseño Estratégico",
        type: "oneTime",
        priceOneTime: 800,
        features: [
          "Auditoría UX/UI del sitio actual",
          "Rediseño de home y páginas de servicio",
          "Mejora de estructura de contenidos",
          "Optimización básica para conversiones (formularios / leads)",
        ],
        addons: [
          {
            id: "redesign-pro-seo",
            label: "Revisión SEO On-Page (hasta 10 páginas)",
            priceOneTime: 260,
          },
          {
            id: "redesign-pro-migration",
            label: "Migración a nuevo hosting o CMS",
            priceOneTime: 220,
          },
          {
            id: "redesign-pro-maint",
            label: "Mantenimiento mensual",
            priceMonthly: 200,
          },
        ],
      },
      {
        id: "redesign-full",
        name: "Rediseño Completo",
        type: "oneTime",
        priceOneTime: 1200,
        features: [
          "Estrategia completa de arquitectura de información",
          "Rediseño global del sitio orientado a resultados",
          "Implementación de nuevas secciones / landings internas",
          "Optimización UX/UI y performance general",
        ],
        addons: [
          {
            id: "redesign-full-seo",
            label: "SEO técnico + On-Page (hasta 20 páginas)",
            priceOneTime: 420,
          },
          {
            id: "redesign-full-analytics",
            label: "Reconfiguración Analytics + eventos clave",
            priceOneTime: 260,
          },
          {
            id: "redesign-full-maint",
            label: "Mantenimiento mensual",
            priceMonthly: 250,
          },
        ],
      },
    ],
  },

  // ---------------- E-COMMERCE ----------------
  ecommerce: {
    label: "E-commerce",
    plans: [
      {
        id: "ecommerce-core",
        name: "Tienda Online",
        type: "oneTime",
        priceOneTime: 3000,
        features: [
          "Seguridad alta",
          "SEO básico",
          "Carga inicial de productos",
        ],
        addons: [
          {
            id: "ecom-hosting",
            label: "Hosting + Dominio",
            priceOneTime: 264,
          },
          {
            id: "ecom-products-upload",
            label: "Subida de productos (por unidad)",
            pricePerUnit: 10, // se multiplica por cantidad
          },
          {
            id: "ecom-maint",
            label: "Mantenimiento tienda",
            priceMonthly: 100,
          },
        ],
      },
    ],
  },

  // ---------------- REAL ESTATE ----------------
  realestate: {
    label: "Real Estate",
    plans: [
      {
        id: "realestate-core",
        name: "Portal Inmobiliario",
        type: "oneTime",
        priceOneTime: 3000,
        features: [
          "Publicación de propiedades",
          "Agenda de visitas / reservas",
          "Correos corporativos",
          "Seguridad alta",
        ],
        addons: [
          {
            id: "re-hosting",
            label: "Hosting + Dominio",
            priceOneTime: 256,
          },
          {
            id: "re-elementor",
            label: "Licencia Elementor Pro",
            priceOneTime: 85,
          },
          {
            id: "re-booking",
            label: "Sistema de Reservas",
            priceOneTime: 104,
          },
        ],
      },
    ],
  },

  // ---------------- SEO (MENSUAL) ----------------
  seo: {
    label: "SEO / Crecimiento orgánico",
    plans: [
      {
        id: "seo-basic",
        name: "SEO Básico",
        type: "monthly",
        priceMonthly: 800,
        features: [
          "Auditoría técnica",
          "Palabras clave principales",
          "Optimización On-Page",
          "Configuración Search Console",
          "Reporte mensual",
        ],
      },
      {
        id: "seo-mid",
        name: "SEO Intermedio",
        type: "monthly",
        priceMonthly: 1200,
        features: [
          "Todo lo del Básico",
          "Optimización técnica avanzada",
          "SEO Local (Google Maps)",
          "Contenido optimizado",
          "Linkbuilding inicial",
        ],
      },
      {
        id: "seo-pro",
        name: "SEO Avanzado",
        type: "monthly",
        priceMonthly: 3000,
        features: [
          "Estrategia personalizada",
          "SEO internacional / multilenguaje",
          "Producción de contenido",
          "Consultoría continua",
        ],
      },
      {
        id: "seo-local-boost",
        name: "SEO Local Boost",
        type: "monthly",
        priceMonthly: 600,
        features: [
          "Optimización Google Business",
          "Reseñas / reputación",
          "Señales locales",
          "Landing local de conversión",
        ],
      },
    ],
  },

  // ---------------- SEM / ADS (FB/IG + GOOGLE) ----------------
  sem: {
    label: "SEM / Facebook, Instagram y Google Ads",
    plans: [
      {
        id: "sem-fb-ig-starter",
        name: "Campaña Facebook + Instagram · Starter",
        type: "combo",
        priceOneTime: 400,  // inversión anuncios sugerida (mensual)
        priceMonthly: 350,  // fee de trabajo mensual
        features: [
          "1 campaña activa en Facebook + Instagram",
          "1–2 conjuntos de anuncios",
          "Segmentación básica por intereses y ubicación",
          "Optimización quincenal",
          "Reporte mensual simplificado",
          "Inversión en anuncios recomendada: desde $500–$800 / mes (NO incluida)",
        ],
      },
      {
        id: "sem-fb-ig-growth",
        name: "Campaña Facebook + Instagram · Growth",
        type: "combo",
        priceOneTime: 700,
        priceMonthly: 600,
        features: [
          "Hasta 2–3 campañas activas (tráfico + conversiones)",
          "Múltiples conjuntos de anuncios para test A/B",
          "Segmentación por intereses + audiencias personalizadas",
          "Optimización semanal",
          "Reporte mensual con insights y recomendaciones",
          "Inversión en anuncios recomendada: desde $800–$1,500 / mes (NO incluida)",
        ],
      },
      {
        id: "sem-fb-ig-pro",
        name: "Campaña Facebook + Instagram · Pro",
        type: "combo",
        priceOneTime: 1200,
        priceMonthly: 900,
        features: [
          "Estrategia completa (tráfico, conversiones y remarketing)",
          "Pruebas A/B avanzadas de creatividades y públicos",
          "Reunión de revisión de resultados 1 vez al mes",
          "Optimización 1–2 veces por semana",
          "Dashboard / reporte detallado",
          "Inversión en anuncios recomendada: desde $1,500 / mes en adelante (NO incluida)",
        ],
      },

      // 🔍 GOOGLE ADS
      {
        id: "sem-google-basic",
        name: "Google Ads · Búsqueda Básica",
        type: "combo",
        priceOneTime: 400,
        priceMonthly: 300,
        features: [
          "1 campaña de búsqueda enfocada en captación de clientes",
          "Palabras clave principales + negativas básicas",
          "Optimización quincenal",
          "Reporte mensual básico",
          "Inversión en anuncios recomendada: desde $300–$500 / mes (NO incluida)",
        ],
      },
      {
        id: "sem-google-growth",
        name: "Google Ads · Growth",
        type: "combo",
        priceOneTime: 600,
        priceMonthly: 400,
        features: [
          "Hasta 2–3 campañas (búsqueda + remarketing o display)",
          "Estrategia de keywords y concordancias avanzada",
          "Optimización semanal",
          "Reporte mensual con análisis de conversiones",
          "Inversión en anuncios recomendada: desde $500–$900 / mes (NO incluida)",
        ],
      },
      {
        id: "sem-google-pro",
        name: "Google Ads · Full Funnel",
        type: "combo",
        priceOneTime: 800,
        priceMonthly: 650,
        features: [
          "Estrategia completa (búsqueda, display, remarketing y/o YouTube)",
          "Configuración de conversiones y eventos clave",
          "Optimización continua varias veces por semana",
          "Revisión estratégica mensual",
          "Inversión en anuncios recomendada: +$1,000 / mes (NO incluida)",
        ],
      },
    ],
  },

  // ---------------- MANTENIMIENTO ----------------
  mantenimiento: {
    label: "Mantenimiento Web",
    plans: [
      {
        id: "maint-basic",
        name: "Básico",
        type: "monthly",
        priceMonthly: 200,
        features: [
          "Hasta 5 cambios/mes",
          "Backups",
          "Monitoreo uptime",
          "Seguridad activa básica",
        ],
      },
      {
        id: "maint-pro",
        name: "Pro",
        type: "monthly",
        priceMonthly: 400,
        features: [
          "Hasta 12 cambios/mes",
          "Soporte técnico prioritario",
          "Parcheo de bugs",
          "Optimización de performance",
        ],
      },
      {
        id: "maint-full",
        name: "Full Care",
        type: "monthly",
        priceMonthly: 700,
        features: [
          "Cambios ilimitados razonables",
          "Mejoras UX/UI",
          "Consultoría continua",
          "Monitoreo proactivo 24/7",
        ],
      },
    ],
  },
};

export default SERVICES;
