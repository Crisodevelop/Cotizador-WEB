const SERVICES = {
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
          { id: "hosting", label: "Hosting + Dominio (1 año)", priceOneTime: 240 },
          { id: "mantenimiento", label: "Mantenimiento mensual", priceMonthly: 200 },
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
          { id: "hosting", label: "Hosting + Dominio (1 año)", priceOneTime: 240 },
          { id: "mantenimiento", label: "Mantenimiento mensual", priceMonthly: 200 },
          { id: "hubspot", label: "Integración CRM / HubSpot", priceOneTime: 300 },
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
          { id: "hosting", label: "Hosting + Dominio (1 año)", priceOneTime: 240 },
          { id: "mantenimiento", label: "Mantenimiento mensual", priceMonthly: 200 },
          { id: "Google + Pixel", label: "Setup Google Analytics + Pixel", priceOneTime: 350 },
        ],
      },
    ],
  },

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
          { id: "hosting", label: "Hosting + Dominio", priceOneTime: 264 },
          { id: "productos", label: "Subida de productos (por unidad)", pricePerUnit: 10 },
          { id: "mantenimiento-ecom", label: "Mantenimiento tienda", priceMonthly: 100 },
        ],
      },
    ],
  },

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
          { id: "hosting-re", label: "Hosting + Dominio", priceOneTime: 256 },
          { id: "elementor", label: "Licencia Elementor Pro", priceOneTime: 85 },
          { id: "booking", label: "Sistema de Reservas", priceOneTime: 104 },
        ],
      },
    ],
  },

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

  sem: {
    label: "SEM / Google Ads",
    plans: [
      {
        id: "sem-setup",
        name: "Campaña Ads + Gestión",
        type: "combo", // setup + mensual
        priceOneTime: 1000,       // setup inicial
        priceMonthly: 350,        // gestión mensual
        features: [
          "Estrategia orientada a conversión",
          "Optimización continua",
          "Reporte de rendimiento",
        ],
      },
    ],
  },

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
