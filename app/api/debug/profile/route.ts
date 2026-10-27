/**
 * DEBUG ONLY — Hapus file ini setelah masalah teratasi.
 * GET /api/debug/profile — Cek profil user yang sedang login (pakai service role)
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Tidak ada sesi", userError }, { status: 401 });
  }

  // Cek via anon key (bisa terkena RLS)
  const { data: profileAnon, error: anonError } = await supabase
    .from("profiles")
    .select("id, login_id, role, display_name, is_active")
    .eq("id", user.id)
    .maybeSingle();

  // Cek via service key (bypass RLS)
  const service = createServiceClient();
  const { data: profileService, error: serviceError } = await service
    .from("profiles")
    .select("id, login_id, role, display_name, is_active")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    userId: user.id,
    userEmail: user.email,
    profileViaAnon: profileAnon,
    anonError: anonError?.message ?? null,
    profileViaService: profileService,
    serviceError: serviceError?.message ?? null,
  });
}
