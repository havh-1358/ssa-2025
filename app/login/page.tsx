import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants/routes";
import { LoginClient } from "./LoginClient";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(ROUTES.HOME);
  }

  const params = await searchParams;
  const errorParam = params.error === "auth_failed" ? params.error : null;

  return <LoginClient errorParam={errorParam} />;
}
