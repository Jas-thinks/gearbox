"use client";

import * as React from "react";
import { Mail, Send, Loader2 } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card3D } from "@/components/ui/card-3d";
import { FadeIn } from "@/components/shared/fade-in";
import { siteConfig } from "@/config/site";

export function ContactContent() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error?.message || data.message || "Something went wrong");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              Contact
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get in touch
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Have a question or want to partner with us? We&apos;d love to hear from you.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px]">
          <FadeIn delay={0.1}>
            <Card3D intensity={0} glare={false} className="p-8">
              {status === "success" ? (
                <div className="py-8 text-center">
                  <p className="text-lg font-semibold">Message sent!</p>
                  <p className="mt-2 text-muted-foreground">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        required
                        placeholder="Your name"
                        className="mt-2"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="mt-2"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      required
                      placeholder="How can we help?"
                      className="mt-2"
                      value={form.subject}
                      onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      required
                      placeholder="Tell us more..."
                      className="mt-2"
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  )}
                  <Button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card3D>
          </FadeIn>

          <FadeIn delay={0.2} className="space-y-4">
            <Card3D className="p-6">
              <Mail className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">Email</h3>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="mt-1 block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {siteConfig.links.email}
              </a>
            </Card3D>
            <Card3D className="p-6">
              <InstagramIcon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">Instagram</h3>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                @gearbox
              </a>
            </Card3D>
            <Card3D className="p-6">
              <LinkedinIcon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">LinkedIn</h3>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Gearbox
              </a>
            </Card3D>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
