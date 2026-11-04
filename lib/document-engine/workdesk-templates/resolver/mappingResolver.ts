export function toPossessiveSuffix(value: string) {
  return `${value}${/[aeıioöuü]$/i.test(value) ? "nın" : "ın"}`;
}

export function toLocativeSuffix(value: string) {
  return `${value}${/[aeıioöuü]$/i.test(value) ? "nda" : "da"}`;
}
