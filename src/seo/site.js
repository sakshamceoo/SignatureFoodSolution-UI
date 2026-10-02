/**
 * Central site SEO + LLM discovery config.
 * Update SITE_URL when the production domain is confirmed.
 */
export const SITE_URL = "https://signaturefoodsolutions.com";

export const SITE = {
  name: "Signature Food Solutions™",
  legalName: "Signature Food Solutions™",
  tagline: "Freshness, Delivered Without Compromise.",
  description:
    "Signature Food Solutions™ supplies farm-fresh chicken, premium mutton, seafood, and ready-to-eat products across Delhi NCR. Hygienic processing, cold-chain delivery, and bulk supply for restaurants, hotels, caterers, retailers, and wholesalers.",
  email: "vortexventures.india@gmail.com, signaturefoodsolutions@gmail.com",
  phoneDisplay: "+91 9999889036\n+91 9667919993",
  phoneE164: "+919999889036\n+919667919993",
  whatsapp: "https://wa.me/919999889036?text=Hi%20Signature%20Food%20Solutions%E2%84%A2%20i%20have%20the%20enquiry%20regarding%20the%20products%20you%20are%20offering%20",
  address: {
    locality: "Shahdara",
    region: "Delhi",
    country: "IN",
    areaServed: "Delhi NCR",
  },
  parentOrg: "Vortex Ventures",
  locale: "en_IN",
  language: "en",
  sameAs: [],
  keywords: [
    "fresh chicken Delhi",
    "poultry supplier Delhi NCR",
    "bulk chicken supply",
    "mutton supplier Delhi",
    "seafood wholesale Delhi",
    "ready to eat chicken",
    "cold chain meat delivery",
    "restaurant poultry supplier",
    "hotel meat supplier",
    "Signature Food Solutions™",
  ],
};

export const PRODUCT_CATEGORIES = [
  {
    name: "Fresh Chicken",
    description:
      "Fresh chicken cuts including boneless thigh, curry cut, drumsticks, wings, breast, whole chicken, and gizzard.",
  },
  {
    name: "Premium Mutton",
    description: "Premium mutton curry cut, whole leg, paya, liver, and kidney.",
  },
  {
    name: "Seafood",
    description: "Fresh seafood including prawns, crab, and popular fish varieties.",
  },
  {
    name: "Ready To Eat",
    description:
      "Ready-to-eat kebabs, tikka, soup, and prepared poultry products.",
  },
];

/** Per-route SEO (title, description, path, type). */
export const PAGES = {
  home: {
    path: "/",
    title: "Fresh Chicken, Mutton & Seafood Supplier in Delhi NCR",
    description: SITE.description,
    keywords: SITE.keywords.join(", "),
    type: "website",
  },
  products: {
    path: "/products",
    title: "Our Products — Chicken, Mutton, Seafood & Ready to Eat",
    description:
      "Browse Signature Food Solutions™ products: fresh chicken, premium mutton, seafood, and ready-to-eat items. Bulk-ready supply with hygienic processing and cold-chain delivery across Delhi NCR.",
    keywords:
      "chicken products Delhi, mutton wholesale, seafood supplier, ready to eat chicken, bulk poultry catalogue",
    type: "website",
  },
  story: {
    path: "/story",
    title: "Our Story — From Trusted Farms to Fresh Delivery",
    description:
      "Learn how Signature Food Solutions™ partners with trusted farms, raises poultry with care, applies strict quality control, and delivers freshness across Delhi NCR.",
    keywords:
      "poultry farm to table, food quality story, Signature Food Solutions™ story, hygienic meat processing",
    type: "article",
  },
};

export function absoluteUrl(path = "/") {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function fullTitle(pageTitle) {
  return `${pageTitle} | ${SITE.name}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "FoodEstablishment"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.png"),
    image: absoluteUrl("/favicon.png"),
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phoneE164,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: SITE.address.areaServed,
    },
    parentOrganization: {
      "@type": "Organization",
      name: SITE.parentOrg,
    },
    knowsAbout: [
      "Fresh poultry supply",
      "Chicken wholesale",
      "Mutton wholesale",
      "Seafood distribution",
      "Ready-to-eat chicken products",
      "Cold-chain food delivery",
      "Bulk food supply for HoReCa",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        telephone: SITE.phoneE164,
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: SITE.sameAs,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/products"),
    url: absoluteUrl("/products"),
    name: PAGES.products.title,
    description: PAGES.products.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: PRODUCT_CATEGORIES.map((cat) => ({
      "@type": "Product",
      name: cat.name,
      description: cat.description,
      brand: { "@type": "Brand", name: SITE.name },
      category: "Food & Beverage",
    })),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PRODUCT_CATEGORIES.map((cat, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cat.name,
        description: cat.description,
        url: absoluteUrl(`/products#cat-${["chicken", "mutton", "seafood", "rte"][i]}`),
      })),
    },
  };
}

export function storyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absoluteUrl("/story"),
    url: absoluteUrl("/story"),
    name: PAGES.story.title,
    description: PAGES.story.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What products does Signature Food Solutions™ supply?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We supply fresh chicken, premium mutton, seafood, and ready-to-eat products for households and bulk buyers such as restaurants, hotels, caterers, retailers, and wholesalers.",
        },
      },
      {
        "@type": "Question",
        name: "Where does Signature Food Solutions™ deliver?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We deliver across Delhi NCR with cold-chain handling to preserve freshness from warehouse to door.",
        },
      },
      {
        "@type": "Question",
        name: "Do you support bulk and wholesale orders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Signature Food Solutions™ specializes in bulk poultry and seafood supply tailored for HoReCa and wholesale buyers.",
        },
      },
      {
        "@type": "Question",
        name: "Where is your warehouse located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our warehouse is located in Shahdara, Delhi.",
        },
      },
    ],
  };
}

export function jsonLdForPath(pathname) {
  const graphs = [organizationJsonLd(), websiteJsonLd()];

  if (pathname === "/" || pathname === "") {
    graphs.push(
      breadcrumbJsonLd([{ name: "Home", path: "/" }]),
      faqJsonLd(),
    );
  } else if (pathname.startsWith("/products")) {
    graphs.push(
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
      ]),
      productsJsonLd(),
    );
  } else if (pathname.startsWith("/story")) {
    graphs.push(
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Our Story", path: "/story" },
      ]),
      storyJsonLd(),
    );
  }

  return graphs;
}

export function pageMetaForPath(pathname) {
  if (pathname.startsWith("/products")) return PAGES.products;
  if (pathname.startsWith("/story")) return PAGES.story;
  return PAGES.home;
}
