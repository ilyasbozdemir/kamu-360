export function formatOfficialEvrakSayisi(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  return [record.birim, record.sayi, record.evrakSayisi].filter(Boolean).join("/");
}
