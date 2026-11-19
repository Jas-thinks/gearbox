export const siteConfig = {
  name: "Gearbox",
  tagline: "Own Less. Create More.",
  description:
    "Rent professional camera equipment from trusted creators around you.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gearbox.app",
  ogImage: "/og-image.png",
  links: {
    email: "hello@gearbox.app",
    instagram: "https://instagram.com/gearbox",
    linkedin: "https://linkedin.com/company/gearbox",
  },
  nav: [
    { label: "Browse", href: "/browse" },
    { label: "Owners", href: "/owners" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    product: [
      { label: "Browse Equipment", href: "/browse" },
      { label: "Become an Owner", href: "/owners" },
      { label: "Join Waitlist", href: "/waitlist" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
} as const;
