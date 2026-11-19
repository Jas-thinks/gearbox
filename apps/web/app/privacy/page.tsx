import { FadeIn } from "@/components/shared/fade-in";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "Gearbox privacy policy — how we collect, use, and protect your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">Last updated: July 4, 2026</p>

          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
            <section className="space-y-4 text-muted-foreground leading-relaxed">
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p>
                When you join our waitlist or contact us, we collect information you provide
                such as your name, email address, phone number, city, and creator preferences.
                We also collect standard usage data through analytics tools.
              </p>

              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p>
                We use your information to notify you about Gearbox launches, improve our
                services, and communicate updates relevant to your interests. We do not sell
                your personal data to third parties.
              </p>

              <h2 className="text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
              <p>
                Your data is stored securely using industry-standard encryption and access
                controls. We retain your information only as long as necessary to provide
                our services or as required by law.
              </p>

              <h2 className="text-xl font-semibold text-foreground">4. Your Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal data
                at any time by contacting us at hello@gearbox.app.
              </p>

              <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
              <p>
                We use essential cookies for site functionality and analytics cookies to
                understand how visitors use our website. You can manage cookie preferences
                through your browser settings.
              </p>

              <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
              <p>
                For privacy-related inquiries, please email us at hello@gearbox.app.
              </p>
            </section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
