import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Menu khusus Admin / Owner
const ADMIN_NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transaksi", href: "/transactions" },
  { label: "Riwayat Transaksi", href: "/transactions/history" },
  { label: "Menu Produk", href: "/products" },
  { label: "Bahan Baku", href: "/inventory" },
  { label: "Resep", href: "/recipes" },
  { label: "Laporan", href: "/reports" },
  { label: "Manajemen Kasir", href: "/cashiers" },
  { label: "Pengaturan", href: "/settings" },
];

// Menu khusus Kasir
const CASHIER_NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transaksi", href: "/transactions" },
  { label: "Riwayat Transaksi", href: "/transactions/history" },
];

export default async function Sidebar() {
  const supabase = await createClient();

  // Ambil user yang sedang login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Ambil profil dan role user
  const { data: profile, error: profileError } = user
    ? await supabase
        .from("profiles")
        .select("role, display_name, must_change_password")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null, error: null };

  // Debug untuk mencari penyebab role owner terbaca sebagai kasir
  console.log("DEBUG ROLE:", {
    userId: user?.id,
    email: user?.email,
    role: profile?.role,
    profileFound: Boolean(profile),
    userError: userError?.message ?? null,
    profileError: profileError?.message ?? null,
  });

  // Normalisasi role supaya tidak sensitif huruf besar/kecil
  const role = String(profile?.role ?? "")
    .trim()
    .toLowerCase();

  const isAdmin = role === "admin" || role === "owner";
  const nav = isAdmin ? ADMIN_NAV : CASHIER_NAV;

  const displayName =
    profile?.display_name?.trim() ||
    user?.email ||
    "Pengguna";

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          MelekCafe
        </Link>

        <p className="mt-1 text-sm text-gray-500">
          Point of Sale
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 px-5 py-4">
        <p className="truncate text-sm font-medium text-gray-800">
          {displayName}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {isAdmin ? "Admin / Owner" : "Kasir"}
        </p>
      </div>
    </aside>
  );
}