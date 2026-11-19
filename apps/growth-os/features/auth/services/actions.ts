"use server";

import { redirect } from "next/navigation";
import { validateAdminCredentials } from "./auth.service";
import { setSession, clearSession } from "@/lib/session";
import { LoginSchema } from "@/schemas/auth.schema";
import type { ApiResponse } from "@/types/common";

export async function loginAction(
  _prevState: ApiResponse | null,
  formData: FormData
): Promise<ApiResponse> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const result = await validateAdminCredentials(parsed.data);

  if (!result.success || !result.session) {
    return { success: false, error: result.error ?? "Login failed." };
  }

  await setSession(result.session);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/admin-secret");
}
