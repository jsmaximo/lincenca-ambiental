import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
