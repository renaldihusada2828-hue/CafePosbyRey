/**
 * Format angka menjadi Rupiah Indonesia.
 * Contoh: formatIDR(12000) → "Rp12.000"
 */
export function formatIDR(
  value: number | string | null | undefined
): string {
  const num =
    typeof value === "string" ? parseFloat(value) : (value ?? 0);

  if (!Number.isFinite(num)) return "Rp0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Parse input Rupiah dari pengguna
 * Contoh: "12.000" atau "12000" menjadi 12000.
 */
export function parseIDRInput(value: string): number {
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);

  return Number.isFinite(num) ? num : 0;
}

/**
 * Format tanggal/waktu ke zona waktu WIB (Asia/Jakarta).
 */
export function formatDateTimeJakarta(ts: string): string {
  return new Date(ts).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateJakarta(ts: string): string {
  return new Date(ts).toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Start-of-day in Asia/Jakarta, returned as ISO string for Supabase queries.
 */
export function startOfDayJakarta(date?: Date): string {
  const d = date ?? new Date();
  const jakarta = new Date(
    d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  jakarta.setHours(0, 0, 0, 0);

  // Offset WIB = UTC+7
  const utc = new Date(jakarta.getTime() - 7 * 60 * 60 * 1000);

  return utc.toISOString();
}

export function endOfDayJakarta(date?: Date): string {
  const d = date ?? new Date();
  const jakarta = new Date(
    d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  jakarta.setHours(23, 59, 59, 999);

  const utc = new Date(jakarta.getTime() - 7 * 60 * 60 * 1000);

  return utc.toISOString();
}

export function todayStringJakarta(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });
}