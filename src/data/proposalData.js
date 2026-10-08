export const PROPOSAL_DETAILS = {
  title: "Website Development Proposal",
  client: "Ruby Red Sales & Services",
  vendor: "GS3 Solution LLC",
  totalInvestment: 1200,
  currency: "USD",
  timelineWeeks: 6,
  objectives: [
    "Develop a complete, professional, and responsive digital commerce website for Ruby Red Sales & Services.",
    "Support existing B2B/bulk wholesale customers with custom tier pricing and quote inquiries.",
    "Create a high-converting online retail (B2C) ordering experience for social media traffic (Instagram, TikTok, Facebook).",
    "Integrate direct WhatsApp ordering and inquiry dispatch for instant customer communication."
  ],
  techStack: {
    frontend: "React.js / Vite / Tailwind CSS / Three.js 3D Canvas",
    backend: "Node.js / Express.js REST APIs",
    database: "PostgreSQL structured database",
    admin: "React Web Administration Dashboard",
    auth: "JWT / Session role-based authentication (Admin, B2B Wholesaler, B2C Retail)",
    cloud: "AWS / Google Cloud production deployment with SSL, CDN & Cloud Storage"
  },
  milestones: [
    {
      number: 1,
      name: "Milestone 1 — Requirement & UI/UX Direction",
      amount: 400,
      timeline: "Week 1",
      status: "completed",
      deliverables: [
        "Requirement finalization & sitemap architecture",
        "UI/UX direction & modern brand design system",
        "Initial responsive web layout & 3D hero canvas integration"
      ]
    },
    {
      number: 2,
      name: "Milestone 2 — Core Web Development & Admin",
      amount: 400,
      timeline: "Weeks 2–4",
      status: "in-progress",
      deliverables: [
        "Product Catalogue with 12 Ramune flavors & exotic snacks",
        "Dual B2C Retail & B2B Wholesale ordering engine",
        "Cart drawer & WhatsApp instant checkout integration",
        "Centralized Admin Panel (Product CRUD, Order Management, Customer approval)"
      ]
    },
    {
      number: 3,
      name: "Milestone 3 — QA, Cloud Deployment & Handover",
      amount: 400,
      timeline: "Weeks 5–6",
      status: "upcoming",
      deliverables: [
        "Integration testing & mobile responsiveness optimization",
        "Production cloud deployment & SSL setup",
        "3 Months Post-Launch Support & final source code handover"
      ]
    }
  ],
  support: "Includes 3 Months of post-launch support for bug fixing, deployment troubleshooting, and minor configuration assistance."
};
