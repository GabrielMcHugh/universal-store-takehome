import { validateSku } from './sku';

test('accepts valid skus', () => {
  expect(validateSku('111111')).toBe('111111');
  expect(validateSku('SKU-001')).toBe('SKU-001');
});

test('rejects invalid skus', () => {
  expect(validateSku('{"$gt":""}')).toBeNull();
  expect(validateSku('')).toBeNull();
  expect(validateSku('a'.repeat(65))).toBeNull();
});
