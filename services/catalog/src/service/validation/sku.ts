const SKU_PATTERN = /^[A-Za-z0-9-]{1,64}$/;

//remove non alphanumeric (and -) characters of a certain length and empty strings
export function validateSku(raw: string): string | null {
  const sku = raw.trim();

  if (!SKU_PATTERN.test(sku)) {
    return null;
  }

  return sku;
}