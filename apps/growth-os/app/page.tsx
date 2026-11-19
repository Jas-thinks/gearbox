import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isSessionValid } from "@/features/auth/services/auth.service";

export default async function RootPage() {
  const session = await getSession();

  if (isSessionValid(session)) {
    redirect("/dashboard");
  }

  redirect("/admin-secret");
}
