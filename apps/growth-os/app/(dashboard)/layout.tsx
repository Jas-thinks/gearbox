import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isSessionValid } from "@/features/auth/services/auth.service";
import { Sidebar } from "@/components/layouts/Sidebar";
import { TopBar } from "@/components/layouts/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!isSessionValid(session)) {
    redirect("/admin-secret");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
