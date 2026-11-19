"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { CreatorType, WaitlistFormData, WaitlistRole } from "@/types/waitlist";

interface WaitlistFormProps {
  defaultRole?: WaitlistRole;
  title?: string;
  description?: string;
}

export function WaitlistForm({
  defaultRole = "creator",
  title = "Join the waitlist",
  description = "Be the first to know when Gearbox launches in your city.",
}: WaitlistFormProps) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState<WaitlistFormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    creatorType: "filmmaker",
    interestedEquipment: "",
    role: defaultRole,
  });

  const update = (partial: Partial<WaitlistFormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
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
    <Card className="overflow-hidden p-8 sm:p-10">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <CheckCircle2 className="size-16 text-emerald-500" />
            </motion.div>
            <h3 className="mt-6 text-2xl font-bold">You&apos;re on the list!</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Thanks for joining, {form.name.split(" ")[0]}! We&apos;ll notify you when
              Gearbox launches in {form.city || "your city"}.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-muted-foreground">{description}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="Your full name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="you@example.com"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    value={form.city}
                    onChange={(e) => update({ city: e.target.value })}
                    placeholder="Mumbai"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Creator Type</Label>
                  <Select
                    value={form.creatorType}
                    onValueChange={(value) =>
                      update({ creatorType: value as CreatorType })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filmmaker">Filmmaker</SelectItem>
                      <SelectItem value="photographer">Photographer</SelectItem>
                      <SelectItem value="content-creator">Content Creator</SelectItem>
                      <SelectItem value="youtuber">YouTuber</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) => update({ role: value as WaitlistRole })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creator">Creator</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="equipment">Interested Equipment</Label>
                <Textarea
                  id="equipment"
                  value={form.interestedEquipment}
                  onChange={(e) => update({ interestedEquipment: e.target.value })}
                  placeholder="Sony A7S III, DJI Mavic 3, lighting kit..."
                  className="mt-2"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
