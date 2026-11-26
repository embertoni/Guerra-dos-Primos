import { it, expect } from 'vitest';
import { primeFactors } from './Primes';
it('decompõe em fatores primos e reconhece primos', () => {
  expect(primeFactors(618)).toEqual([2, 3, 103]);
  expect(primeFactors(360)).toEqual([2, 2, 2, 3, 3, 5]);
  expect(primeFactors(907)).toEqual([907]);
  expect(primeFactors(2)).toEqual([2]);
  expect(primeFactors(1)).toEqual([]);
});