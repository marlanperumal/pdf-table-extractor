export function toSnakeCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "_");
}

export function fromSnakeCase(str: string): string {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
