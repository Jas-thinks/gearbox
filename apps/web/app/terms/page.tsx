import { FadeIn } from "@/components/shared/fade-in";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "Gearbox terms of service — the rules and guidelines for using our platform.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-muted-foreground">Last updated: July 4, 2026</p>

          <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="mt-3">
                By accessing or using Gearbox&apos;s website and services, you agree to be bound
                by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Waitlist & Pre-Launch</h2>
              <p className="mt-3">
                Gearbox is currently in pre-launch. Joining the waitlist does not guarantee
                access to the platform. Features, pricing, and availability described on this
                website are subject to change before launch.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities</h2>
              <p className="mt-3">
                You agree to provide accurate information when registering or contacting us.
                You are responsible for maintaining the confidentiality of any account credentials
                once the platform launches.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
              <p className="mt-3">
                All content on this website — including text, graphics, logos, and design — is
                the property of Gearbox and protected by applicable intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
              <p className="mt-3">
                Gearbox is provided &quot;as is&quot; during the pre-launch phase. We make no warranties
                regarding the availability or accuracy of information on this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Changes to Terms</h2>
              <p className="mt-3">
                We may update these terms at any time. Continued use of our services after
                changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
              <p className="mt-3">
                Questions about these terms? Contact us at hello@gearbox.app.
              </p>
            </section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
