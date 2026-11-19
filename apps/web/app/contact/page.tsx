import { ContactContent } from "@/features/contact/contact-content";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with the Gearbox team.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactContent />;
}
