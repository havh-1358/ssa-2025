import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants/routes";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Placeholder — real Dashboard is implemented in a separate screen plan
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <p className="text-white font-[family-name:var(--font-montserrat)]">
        Welcome, {user.email}
      </p>
    </main>
  );
}
